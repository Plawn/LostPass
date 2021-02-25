# LostPass

## What is it ?

If you need to send secret data to another user, but can't trust your echange medium you can use this app.

This app will store an encrypted version of your secret and return tokens containing the passphrase to you. You can then send this link to your friend and he will be able to use it only once. The data will then be erased from the database.

## How to use it ?

You can either use the complete Dockerfile, or use the Dockerfile and an external redis database.

### Infos

requires python3.8

- Supports illimted lifetime secret

- Supported Modes :
  - AES_GCM (256)
  - FERNET

## TODO

- Add file share
- Fix tests
- add icon
- add docker hub overview
