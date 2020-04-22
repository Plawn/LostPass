from .interface import CryptoEngine
from .aes_gcm import CyptoEngine as aes_gcm_engine
from .fernet_engine import CyptoEngine as fernet_engine
from enum import Enum


class crypto_engines(Enum):
    AES_GCM = aes_gcm_engine
    FERNET = fernet_engine
