import os
import redis
import uuid
from redis.exceptions import ConnectionError
from .token_handler import RedisConf 


if os.environ.get('REDIS_URL'):
    redis_client = redis.StrictRedis.from_url(os.environ.get('REDIS_URL'))
else:
    redis_host = os.environ.get('REDIS_HOST', 'localhost')
    redis_port = os.environ.get('REDIS_PORT', 6379)
    redis_db = os.environ.get('SNAPPASS_REDIS_DB', 0)
    redis_client = redis.StrictRedis(
        host=redis_host, port=redis_port, db=redis_db)


REDIS_PREFIX = os.environ.get('REDIS_PREFIX', 'snappass')

redis_conf = RedisConf(redis_client, REDIS_PREFIX)