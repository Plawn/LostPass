from cryptography.fernet import Fernet
from typing import *

class CyptoEngine:

    def encrypt(self, plain: bytes, encryption_key:bytes=None) -> Tuple[bytes, bytes]:
        if encryption_key is None :
            encryption_key = Fernet.generate_key()
        fernet = Fernet(encryption_key)
        encrypted_password = fernet.encrypt(plain)
        return encrypted_password, encryption_key

    def decrypt(self, encrypted: bytes, decrypt_key: bytes) -> bytes:
        fernet = Fernet(decrypt_key)
        return fernet.decrypt(encrypted)


if __name__ == '__main__':
    c = CyptoEngine()
    t = 'test'.encode('utf-8')
    key = Fernet.generate_key()
    print(key)
    encyrpted, _ = c.encrypt(t, key)
    print(encyrpted)
    result = c.decrypt(encyrpted, key)
    print(result)