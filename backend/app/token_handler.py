
from typing import *
from redis import StrictRedis
import uuid
from dataclasses import dataclass
from .crypto_engine import CyptoEngine

@dataclass
class RedisConf:
    redis: StrictRedis
    prefix: str

class TokenHandler:
    TOKEN_SEPARATOR = '~'

    def __init__(self, redis: RedisConf, crypto_engine: CyptoEngine):
        self.__crypto_engine = crypto_engine
        self.__redis_conf = redis

    def __parse_token(self, token: str) -> Tuple[str, bytes]:
        # Split once, not more.
        token_fragments:List[str] = token.split(self.TOKEN_SEPARATOR, 1)
        storage_key = token_fragments[0]
        decryption_key = token_fragments[1].encode('utf-8')
        return storage_key, decryption_key

    def __make_redis_storage_key(self) -> str:
        return self.__redis_conf.prefix + uuid.uuid4().hex

    def set_content(self, content: str, ttl: int=1, expires=True) -> str:
        """
        Sets the content in the redis and returns a token to access it
        """
        storage_key = self.__make_redis_storage_key()
        encrypted_password, encryption_key = self.__crypto_engine.encrypt(
            content.encode('utf-8'))
        if expires:
            self.__redis_conf.redis.setex(storage_key, ttl, encrypted_password)
        else:
            self.__redis_conf.redis.set(storage_key, encrypted_password)
        return self.TOKEN_SEPARATOR.join([storage_key, encryption_key.decode('utf-8')])

    def is_token_valid(self, token: str) -> bool:
        """checks if a given token is still valid
        """
        storage_key, _ = self.__parse_token(token)
        return self.__redis_conf.redis.exists(storage_key)

    def get_content(self, token: str) -> str:
        """Fetch the data for a given valid token from the redis
        """
        storage_key, decryption_key = self.__parse_token(token)
        encrypted_password = self.__redis_conf.redis.get(storage_key)
        self.__redis_conf.redis.delete(storage_key)

        if encrypted_password is not None:
            password = self.__crypto_engine.decrypt(encrypted_password, decryption_key)
            return password.decode('utf-8')
        raise Exception('password not found')
