import threading
from typing import *
from redis import StrictRedis
import uuid
from dataclasses import dataclass
from .crypto_engine import CyptoEngine


@dataclass
class RedisConf:
    redis: StrictRedis


class TokenHandler:
    TOKEN_SEPARATOR = '~'

    def __init__(self, redis: RedisConf, crypto_engine: CyptoEngine):
        self.__crypto_engine = crypto_engine
        self.__redis_conf = redis
        self.locked_main_keys = {}

    def __parse_token(self, token: str) -> Tuple[str, bytes]:
        # Split once, not more.
        token_fragments: List[str] = token.split(self.TOKEN_SEPARATOR, 2)
        main_storage_key = token_fragments[0]
        second_storage_key = token_fragments[1]
        decryption_key = token_fragments[2].encode('utf-8')
        return main_storage_key, second_storage_key, decryption_key

    def __make_redis_storage_key(self) -> str:
        return uuid.uuid4().hex

    def set_string(self, content: str, ttl: int = 1, nb_token: int = 1, expires=True) -> str:
        """
        Sets the content in the redis and returns a token to access it
        """
        return self.set_bytes(content.encode('utf-8'), ttl, nb_tokens=nb_token, expires=expires)

    def set_bytes(self, content: bytes, ttl: int = 1, nb_tokens: int = 1, expires=True) -> str:
        """
        Sets the content in the redis and returns a token to access it
        """
        encryption_key = self.__crypto_engine.make_key()

        # for tests
        # encryption_key = 'test'
        encrypted_data = self.__crypto_engine.encrypt(
            content, encryption_key)
        main_storage_key = self.__make_redis_storage_key()
        if expires:
            self.__redis_conf.redis.setex(
                main_storage_key, ttl, encrypted_data)
            self.__redis_conf.redis.setex(
                main_storage_key+'_r', ttl, nb_tokens)
        else:
            self.__redis_conf.redis.set(main_storage_key, encrypted_data)
            self.__redis_conf.redis.set(main_storage_key+'_r', nb_tokens)

        derived_keys = [
            (self.__make_redis_storage_key(), self.__crypto_engine.make_key()) for _ in range(nb_tokens)
        ]

        for storage_key, key in derived_keys:
            second_layer_encryption_key = self.__crypto_engine.encrypt(
                encryption_key, key)
            if expires:
                self.__redis_conf.redis.setex(
                    storage_key, ttl, second_layer_encryption_key)
            else:
                self.__redis_conf.redis.set(
                    storage_key, second_layer_encryption_key)

        return [
            self.TOKEN_SEPARATOR.join((main_storage_key, storage_key, encryption_key.decode('utf-8'))) for storage_key, encryption_key in derived_keys
        ]

    def is_token_valid(self, token: str) -> bool:
        """checks if a given token is still valid
        """
        main_storage_key, second_storage_key, _ = self.__parse_token(token)
        return self.__redis_conf.redis.exists(second_storage_key) and self.__redis_conf.redis.exists(main_storage_key)

    def get_string(self, token: str) -> str:
        """Fetch the data for a given valid token from the redis
        """
        return self.get_bytes(token).decode('utf-8')

    def handle_remaining_main(self, key: str) -> None:
        remaining = self.__redis_conf.redis.decr(key+'_r')
        remaining = int(self.__redis_conf.redis.get(key+'_r'))
        if remaining == 0:
            self.__redis_conf.redis.delete(key)
            self.__redis_conf.redis.delete(key+'_r')

    def get_bytes(self, token: str) -> bytes:
        """Fetch the data for a given valid token from the redis
        """

        main_storage_key, second_storage_key, decryption_key = self.__parse_token(
            token)
        encrypted_key = self.__redis_conf.redis.get(second_storage_key)
        try:
            # we need to count how many times a main key has been used
            # in order to delete it when fully used
            if main_storage_key in self.locked_main_keys:
                event = self.locked_main_keys[main_storage_key]
                event.wait()
                event.clear()
            event = threading.Event()
            self.locked_main_keys[main_storage_key] = event
            # handling "see only once"

            self.__redis_conf.redis.delete(second_storage_key)

            if encrypted_key is not None:
                decrypted_key = self.__crypto_engine.decrypt(
                    encrypted_key, decryption_key)
                encrypted_data = self.__redis_conf.redis.get(main_storage_key)
                self.handle_remaining_main(main_storage_key)
                content = self.__crypto_engine.decrypt(
                    encrypted_data, decrypted_key)
                return content
            raise Exception('Content not found')
        finally:
            # if other people aquired this event
            event.set()
            # removing it
            del self.locked_main_keys[main_storage_key]
