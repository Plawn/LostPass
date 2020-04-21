import hashlib
import os
from base64 import b64decode, b64encode

from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes


def encrypt(plain_text, password):
    # generate a random salt
    salt = get_random_bytes(AES.block_size)

    # use the Scrypt KDF to get a private key from the password
    private_key = hashlib.scrypt(
        password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32)

    # create cipher config
    cipher_config = AES.new(private_key, AES.MODE_GCM)

    # return a dictionary with the encrypted text
    cipher_text, tag = cipher_config.encrypt_and_digest(
        bytes(plain_text, 'utf-8'))
    # salt, nonce, tag, cipher
    return b64encode(salt+cipher_config.nonce+tag+cipher_text)


def decrypt(encrypted, password):
    encrypted = b64decode(encrypted)
    salt = encrypted[0:16]
    nonce = encrypted[16:32]
    tag = encrypted[32:48]
    cipher_text = encrypted[48:]

    # generate the private key from the password and salt
    private_key = hashlib.scrypt(
        password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32)

    # create the cipher config
    cipher = AES.new(private_key, AES.MODE_GCM, nonce=nonce)

    # decrypt the cipher text
    decrypted = cipher.decrypt_and_verify(cipher_text, tag)

    return decrypted


def main():
    password = input("Password: ")

    # First let us encrypt secret message
    encrypted = encrypt("The secretest mesfffsage here"*10, password)
    print(encrypted)

    # Let us decrypt using our original password
    decrypted = decrypt(encrypted, password)
    print(bytes.decode(decrypted))
    print(decrypted)


main()
