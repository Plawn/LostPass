from cryptography.fernet import Fernet
from typing import *


class CyptoEngine:
    """
    Abstraction to handle crypto operations
    """

    def make_key(self):
        return Fernet.generate_key()

    def encrypt(self, plain: bytes, encryption_key: bytes) -> bytes:
        fernet = Fernet(encryption_key)
        return fernet.encrypt(plain)

    def decrypt(self, encrypted: bytes, decrypt_key: bytes) -> bytes:
        fernet = Fernet(decrypt_key)
        return fernet.decrypt(encrypted)
