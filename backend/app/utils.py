import random as rd
from string import printable

import yaml

from .conf_handler import Conf


def get_conf(conf_filename: str) -> Conf:
    with open(conf_filename, 'r') as f:
        conf = Conf(**yaml.safe_load(f))
    return conf


def get_secret(length: int) -> str:
    return ''.join(rd.choice(printable) for _ in range(length))
