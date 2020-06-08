# LostPass

### How to run it ?

Without docker 

Run a redis, with the default user and use the configuration file to setup it with the application

use the start_standalone.sh script to start the app

With docker

Run a redis, in a container

use the configuration file to setup it with the application and don't forget to mount it, in the container

use the Dockerfile to build the image and simply run it

### Infos 

requires python3.7

- Supports illimted lifetime secret

- Supported Modes
    - AES_GCM (256)
    - FERNET

## TODO

- Add file share 
- Add support for AES_CTR
- Add support for AES_CBC
- Fix tests
