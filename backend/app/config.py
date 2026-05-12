from os import getenv


def _required_setting(name: str) -> str:
    value = getenv(name)
    if not value:
        raise RuntimeError(f"The {name} environment variable is required.")
    return value


JWT_SECRET_KEY = _required_setting("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = int(getenv("ACCESS_TOKEN_EXPIRE_SECONDS", "300"))
REFRESH_TOKEN_EXPIRE_SECONDS = int(getenv("REFRESH_TOKEN_EXPIRE_SECONDS", "900"))

VALID_USERNAME = _required_setting("AUTH_USERNAME")
VALID_PASSWORD = _required_setting("AUTH_PASSWORD")
