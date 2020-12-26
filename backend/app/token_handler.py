import logging
import threading
from typing import *
from redis import StrictRedis
import uuid
from dataclasses import dataclass
from .crypto_engines import CryptoEngine


class InvalidToken(Exception):
    pass


REMAINING_SUFFIX = '_r'
TOKEN_SEPARATOR = '~'


class TokenHandler:

    def __init__(
        self,
        secret: str,
        redis: StrictRedis,
        crypto_engine: CryptoEngine,
        *,
        logger: Optional[logging.Logger] = None,
        debug: bool = False
    ):
        self.__crypto_engine = crypto_engine
        self.__redis_conf = redis
        self._logger = logger or logging.getLogger()
        # TODO: assert!
        # put lock inside redis for better scaling ?
        self.__locked_main_keys = {}
        self.__secret = self.__crypto_engine.prepare_encryption_key(secret)
        self.__debug = debug

    def __parse_token(self, token: str) -> Tuple[str, bytes]:
        # determine if two layers and parse accordingly
        try:
            token = (
                self.__crypto_engine
                .decrypt(
                    token.encode('utf-8'),
                    self.__secret
                )
                .decode('utf-8')
            )
            # Split once, not more.
            token_fragments = token.split(TOKEN_SEPARATOR, 2)
            if (length := len(token_fragments)) != 3:
                raise InvalidToken(
                    f'Expected token fragments is 3 and got {length}'
                )
            main_storage_key, second_storage_key = token_fragments[0:2]
            decryption_key = token_fragments[2].encode('utf-8')
        except InvalidToken:
            raise
        except Exception as e:
            raise InvalidToken
        return main_storage_key, second_storage_key, decryption_key

    def __make_redis_storage_key(self) -> str:
        return uuid.uuid4().hex

    def set_string(self, content: str, ttl: int = 1, nb_token: int = 1, expires: bool = True) -> Tuple[List[str], int]:
        """
        Sets the content in the redis and returns a token to access it
        """
        return self.set_bytes(content.encode('utf-8'), ttl, nb_tokens=nb_token, expires=expires)

    def set_bytes(self, content: bytes, ttl: int = 1, nb_tokens: int = 1, expires: bool = True) -> Tuple[List[str], int]:
        """
        Sets the content in the redis and returns a token to access it
        """
        # use the given method -> 1 layer or 2 layers
        stored = 0
        encryption_key = self.__crypto_engine.make_key()

        encrypted_data = self.__crypto_engine.encrypt(
            content, encryption_key)
        main_storage_key = self.__make_redis_storage_key()
        stored += len(encrypted_data)
        if expires:
            self.__redis_conf.setex(
                main_storage_key, ttl, encrypted_data)
            self.__redis_conf.setex(
                main_storage_key+REMAINING_SUFFIX, ttl, nb_tokens)
        else:
            self.__redis_conf.set(main_storage_key, encrypted_data)
            self.__redis_conf.set(
                main_storage_key+REMAINING_SUFFIX, nb_tokens)

        derived_keys = [
            (self.__make_redis_storage_key(), self.__crypto_engine.make_key()) for _ in range(nb_tokens)
        ]
        derived_key_size = len(derived_keys[0][1]) * len(derived_keys)
        stored += derived_key_size
        for storage_key, key in derived_keys:
            second_layer_encryption_key = self.__crypto_engine.encrypt(
                encryption_key, key)
            if expires:
                self.__redis_conf.setex(
                    storage_key, ttl, second_layer_encryption_key)
            else:
                self.__redis_conf.set(
                    storage_key, second_layer_encryption_key)

        self._logger.info(f'used {stored} bytes to store {len(content)}')
        # could be nicer
        return [
            self.__crypto_engine.encrypt(TOKEN_SEPARATOR.join((
                main_storage_key, storage_key, encryption_key.decode('utf-8'))
            )
                .encode('utf-8'), self.__secret)
            .decode('utf-8') for storage_key, encryption_key in derived_keys
        ], stored if self.__debug else 0

    def is_token_valid(self, token: str) -> bool:
        """checks if a given token is still valid
        """
        main_storage_key, second_storage_key, _ = self.__parse_token(token)
        return self.__redis_conf.exists(second_storage_key)

    def get_string(self, token: str) -> str:
        """Fetch the data for a given valid token from the redis
        """
        return self.get_bytes(token).decode('utf-8')

    def handle_remaining_main(self, key: str) -> None:
        remaining = self.__redis_conf.decr(key + REMAINING_SUFFIX)
        remaining = int(self.__redis_conf.get(key + REMAINING_SUFFIX))
        if remaining == 0:
            self.__redis_conf.delete(key)
            self.__redis_conf.delete(key + REMAINING_SUFFIX)

    def get_bytes(self, token: str) -> bytes:
        """Fetch the data for a given valid token from the redis
        """

        main_storage_key, second_storage_key, decryption_key = self.__parse_token(
            token)
        encrypted_key = self.__redis_conf.get(second_storage_key)
        try:
            # we need to count how many times a main key has been used
            # in order to delete it when fully used
            if main_storage_key in self.__locked_main_keys:
                event = self.__locked_main_keys[main_storage_key]
                event.wait()
                event.clear()
            event = threading.Event()
            self.__locked_main_keys[main_storage_key] = event
            # handling "see only once"

            self.__redis_conf.delete(second_storage_key)

            if encrypted_key is not None:
                decrypted_key = self.__crypto_engine.decrypt(
                    encrypted_key, decryption_key)
                encrypted_data = self.__redis_conf.get(main_storage_key)
                self.handle_remaining_main(main_storage_key)
                content = self.__crypto_engine.decrypt(
                    encrypted_data, decrypted_key)
                return content
            raise Exception('Content not found')
        finally:
            # if other people aquired this event
            event.set()
            # removing it
            del self.__locked_main_keys[main_storage_key]
