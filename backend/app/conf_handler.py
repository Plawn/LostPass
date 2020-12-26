from typing import List, Optional

from pydantic import BaseModel, BaseSettings

from .crypto_engines import CryptoEngines


class RedisConfig(BaseModel):
    host: str
    port: int
    db: int


class CryptoConfig(BaseModel):
    mode: CryptoEngines
    secret: str


class FlaskConfig(BaseModel):
    serve_front: bool
    cors: Optional[List[str]]


class Conf(BaseModel):
    redis: RedisConfig
    flask: FlaskConfig
    crypto: CryptoConfig

class Settings(BaseSettings):
    conf_filename: str = 'conf.yaml'
    debug: bool = False

    class Config:
        fields = {
            'conf_filename': 'CONF_FILE'
        }
