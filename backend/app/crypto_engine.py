
from cryptography.fernet import Fernet
from cryptography import utils as utils
from typing import *
import base64
import hashlib
import os
from base64 import b64decode, b64encode

from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes


class CyptoEngine:
    """
    Abstraction to handle crypto operations
    """

    def string_as_key(self, string: str) -> bytes:
        """prepares a string to be used as an encryption key
        """
        # k = string.encode('utf-8')
        # key = k +
        return base64.urlsafe_b64encode(key)

    def make_key(self):
        return Fernet.generate_key()

    # def encrypt(self, plain: bytes, encryption_key: bytes) -> bytes:
    #     fernet = Fernet(encryption_key)
    #     return fernet.encrypt(plain)

    # def decrypt(self, encrypted: bytes, decrypt_key: bytes) -> bytes:
    #     fernet = Fernet(decrypt_key)
    #     return fernet.decrypt(encrypted)
    def encrypt(self, plain:bytes , password:bytes ) -> bytes:
        # generate a random salt
        salt = get_random_bytes(AES.block_size)

        # use the Scrypt KDF to get a private key from the password
        private_key = hashlib.scrypt(
            password, salt=salt, n=2**14, r=8, p=1, dklen=32)

        # create cipher config
        cipher_config = AES.new(private_key, AES.MODE_GCM)

        # return a dictionary with the encrypted text
        cipher_text, tag = cipher_config.encrypt_and_digest(plain)
        # salt, nonce, tag, cipher
        return b64encode(salt+cipher_config.nonce+tag+cipher_text)


    def decrypt(self, encrypted:bytes, password:bytes) -> bytes:
        encrypted = b64decode(encrypted)
        salt = encrypted[0:16]
        nonce = encrypted[16:32]
        tag = encrypted[32:48]
        cipher_text = encrypted[48:]

        # generate the private key from the password and salt
        private_key = hashlib.scrypt(
            password, salt=salt, n=2**14, r=8, p=1, dklen=32)

        # create the cipher config
        cipher = AES.new(private_key, AES.MODE_GCM, nonce=nonce)

        # decrypt the cipher text
        decrypted = cipher.decrypt_and_verify(cipher_text, tag)

        return decrypted
