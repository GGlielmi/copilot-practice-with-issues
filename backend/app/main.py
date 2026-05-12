from fastapi import FastAPI, HTTPException, status

from app.config import (
    ACCESS_TOKEN_EXPIRE_SECONDS,
    REFRESH_TOKEN_EXPIRE_SECONDS,
    VALID_PASSWORD,
    VALID_USERNAME,
)
from app.schemas import HealthResponse, LoginRequest, RefreshRequest, TokenResponse
from app.security import create_token, decode_token

app = FastAPI(title="JWT Demo API", version="0.1.0")


def _build_token_response(username: str) -> TokenResponse:
    return TokenResponse(
        access_token=create_token(username, "access", ACCESS_TOKEN_EXPIRE_SECONDS),
        refresh_token=create_token(username, "refresh", REFRESH_TOKEN_EXPIRE_SECONDS),
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
    )


@app.get("/", response_model=HealthResponse)
def read_root() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/token", response_model=TokenResponse)
def create_access_token(payload: LoginRequest) -> TokenResponse:
    if payload.username != VALID_USERNAME or payload.password != VALID_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    return _build_token_response(payload.username)


@app.post("/token/refresh", response_model=TokenResponse)
def refresh_access_token(payload: RefreshRequest) -> TokenResponse:
    decoded_payload = decode_token(payload.refresh_token, expected_type="refresh")
    return _build_token_response(decoded_payload["sub"])
