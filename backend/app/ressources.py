import os
import random as rd
from string import printable

import redis
import yaml

from .conf_handler import Conf
from .crypto_engines import crypto_engines
from .token_handler import TokenHandler

conf_filename = os.environ.get('CONF_FILE', 'conf.yaml')

# TODO:
# should be in conf
MAX_MULTI_LINK = 15
NEW_SECRET_TOKEN = '{{random}}'
SECRET_LEN = 20


def get_conf() -> Conf:
    with open(conf_filename, 'r') as f:
        conf = Conf(**yaml.safe_load(f))
    return conf


def get_secret(length: int) -> str:
    return ''.join(rd.choice(printable) for _ in range(length))


conf = get_conf()

redis_client = redis.StrictRedis(
    host=conf.redis.host,
    port=conf.redis.port,
    db=conf.redis.db
)

secret = conf.crypto.secret if conf.crypto.secret != NEW_SECRET_TOKEN else get_secret(
    SECRET_LEN)

# getting an engine
engine = (crypto_engines[conf.crypto.mode])()
token_handler = TokenHandler(
    secret, redis=redis_client, crypto_engine=engine)
