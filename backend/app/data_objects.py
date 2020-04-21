from dataclasses import dataclass

@dataclass
class RedisConfig:
    host: str
    port: int
    db: int


@dataclass
class Conf:
    redis: RedisConfig
    self_served: bool
