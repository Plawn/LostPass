

import redis


from .crypto_engines import crypto_engines
from .token_handler import TokenHandler
from .utils import get_conf, get_secret
from .conf_handler import Settings


settings = Settings()


# TODO:
# should be in conf
MAX_MULTI_LINK = 15
NEW_SECRET_TOKEN = '{{random}}'
SECRET_LEN = 20


conf = get_conf(settings.conf_filename)

redis_client = redis.StrictRedis(
    host=conf.redis.host,
    port=conf.redis.port,
    db=conf.redis.db
)

secret = conf.crypto.secret if conf.crypto.secret != NEW_SECRET_TOKEN else get_secret(
    SECRET_LEN)

# getting an engine
engine = crypto_engines[conf.crypto.mode]()
token_handler = TokenHandler(
    secret,
    redis=redis_client,
    crypto_engine=engine,
    debug=settings.debug
)
