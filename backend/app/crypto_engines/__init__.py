from typing import Dict, Type
from .interface import CryptoEngine
from .aes_gcm import CyptoEngine as aes_gcm_engine
from .fernet_engine import CyptoEngine as fernet_engine
from enum import Enum


class CryptoEngines(Enum):
    AES_GCM = 'AES_GCM'
    FERNET = 'FERNET'


crypto_engines: Dict[CryptoEngines, Type[CryptoEngine]] = {
    CryptoEngines.AES_GCM: aes_gcm_engine,
    CryptoEngines.FERNET: fernet_engine,
}
