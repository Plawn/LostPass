from dataclasses import dataclass, fields
from .crypto_engines import crypto_engines


def dataclass_from_dict(klass, d):
    try:
        fieldtypes = {f.name: f.type for f in fields(klass)}
        return klass(**{f: dataclass_from_dict(fieldtypes[f], d[f]) for f in d})
    except:
        return d  # Not a dataclass field


@dataclass
class RedisConfig:
    host: str
    port: int
    db: int


@dataclass
class CryptoConfig:
    mode: crypto_engines
    secret: str


@dataclass
class FlaskConfig:
    serve_front: bool


@dataclass
class Conf:
    redis: RedisConfig
    flask: FlaskConfig
    crypto: CryptoConfig
