
from cryptography.fernet import Fernet
from typing import *
import hashlib
from base64 import b64decode, b64encode
from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes


class CyptoEngine:
    """
    Abstraction to handle crypto operations
    """

    def make_key(self):
        return Fernet.generate_key()


    def prepare_encryption_key(self, password:str) -> bytes:
        return password.encode('utf-8')

    def encrypt(self, plain: bytes, password: bytes) -> bytes:
        # generate a random salt
        salt = get_random_bytes(AES.block_size)

        # use the Scrypt KDF to get a private key from the password
        private_key = hashlib.scrypt(
            password, salt=salt, n=2**14, r=8, p=1, dklen=32)

        # create cipher config
        cipher_config = AES.new(private_key, AES.MODE_GCM)

        # return a dictionary with the encrypted text
        # salt : length 16
        # nonce : length 16
        # tag : length 16
        # cipher_text : lentgh any

        cipher_text, tag = cipher_config.encrypt_and_digest(plain)
        # salt, nonce, tag, cipher
        return b64encode(salt+cipher_config.nonce+tag+cipher_text)

    def decrypt(self, encrypted: bytes, password: bytes) -> bytes:
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
