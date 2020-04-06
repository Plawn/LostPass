from cryptography.fernet import Fernet
from typing import *

class CyptoEngine:

    def encrypt(self, plain: bytes) -> Tuple[bytes, bytes]:
        encryption_key = Fernet.generate_key()
        fernet = Fernet(encryption_key)
        encrypted_password = fernet.encrypt(plain)
        return encrypted_password, encryption_key

    def decrypt(self, encrypted: bytes, decrypt_key: bytes) -> bytes:
        fernet = Fernet(decrypt_key)
        return fernet.decrypt(encrypted)