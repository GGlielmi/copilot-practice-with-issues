# JWT Demo API con FastAPI

Este repositorio incluye una aplicación Web API en Python/FastAPI dentro de la carpeta `/backend` que implementa autenticación JWT con:

- Login con usuario `admin` y contraseña `admin123`
- Token de acceso con expiración de `300` segundos
- Endpoint para refrescar tokens
- Gestión de dependencias con Poetry
- Archivos `Dockerfile` y `docker-compose.yml` para despliegue con Docker

## Estructura

```text
backend/
├── app/
│   ├── config.py
│   ├── main.py
│   ├── schemas.py
│   └── security.py
├── Dockerfile
├── docker-compose.yml
└── pyproject.toml
```

## Requisitos

- Python 3.12+
- Poetry 2.3.3+
- Docker y Docker Compose (opcional)

## Ejecución local con Poetry

```bash
cd backend
poetry install --no-root
poetry run uvicorn app.main:app --reload
```

La API quedará disponible en `http://127.0.0.1:8000`.

## Endpoints

### `POST /token`

Genera un token de acceso y un refresh token.

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Ejemplo:

```bash
curl -X POST http://127.0.0.1:8000/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### `POST /token/refresh`

Refresca el token a partir de un `refresh_token`.

```json
{
  "refresh_token": "<refresh_token>"
}
```

Ejemplo:

```bash
curl -X POST http://127.0.0.1:8000/token/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<refresh_token>"}'
```

## Ejecución con Docker

```bash
cd backend
docker compose up --build
```

La API quedará expuesta en `http://127.0.0.1:8000`.

## Variables de entorno

- `JWT_SECRET_KEY`: clave secreta para firmar JWT
- `ACCESS_TOKEN_EXPIRE_SECONDS`: duración del access token (por defecto `300`)
- `REFRESH_TOKEN_EXPIRE_SECONDS`: duración del refresh token (por defecto `900`)

## Documentación automática

FastAPI expone la documentación Swagger en:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`
