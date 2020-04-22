from abc import ABC, abstractmethod


class CryptoEngine(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def make_key(self) -> bytes:
        pass

    @abstractmethod
    def prepare_encryption_key(self, password: str) -> bytes:
        pass

    @abstractmethod
    def encrypt(self, plain: bytes, encryption_key: bytes) -> bytes:
        pass

    @abstractmethod
    def decrypt(self, encrypted: bytes, encryption_key: bytes) -> bytes:
        pass
