from cryptography.fernet import Fernet
from typing import *
from .interface import CryptoEngine as BaseEngine
import hashlib
import base64


class CyptoEngine(BaseEngine):
    """
    Abstraction to handle crypto operations
    """

    def make_key(self):
        return Fernet.generate_key()

    def prepare_encryption_key(self, password: str) -> bytes:
        l= base64.urlsafe_b64encode(hashlib.sha3_256(password.encode('utf-8')).digest())
        print(len(l))
        return l

    def encrypt(self, plain: bytes, encryption_key: bytes) -> bytes:
        fernet = Fernet(encryption_key)
        return fernet.encrypt(plain)

    def decrypt(self, encrypted: bytes, decrypt_key: bytes) -> bytes:
        fernet = Fernet(decrypt_key)
        return fernet.decrypt(encrypted)
