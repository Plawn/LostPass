import os
import uuid

import redis
import yaml
from redis.exceptions import ConnectionError

from .data_objects import Conf
from .token_handler import RedisConf
from .utils import dataclass_from_dict

conf_filename = os.environ.get('CONF_FILE', 'conf.yaml')


def get_conf() -> Conf:
    with open(conf_filename, 'r') as f:
        conf = dataclass_from_dict(Conf, yaml.safe_load(f))
    return conf


conf = get_conf()

redis_client = redis.StrictRedis(
    host=conf.redis.host, port=conf.redis.port, db=conf.redis.db)

redis_conf = RedisConf(redis_client)
