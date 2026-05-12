# Compliance Platform: backend + frontend de login

Este repositorio incluye dos aplicaciones integradas:

- `/backend`: API FastAPI con autenticación JWT.
- `/frontend`: aplicación React para iniciar sesión y acceder a una vista protegida.

## Requisitos

- Python 3.12+
- Poetry 2.3+
- Node.js 24+
- npm 11+

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
frontend/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Backend

### Instalación y ejecución local

```bash
cd backend
cp .env.example .env
poetry install --no-root
set -a
source .env
set +a
poetry run uvicorn app.main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000`.

### Endpoints disponibles

#### `GET /`

Devuelve el estado del servicio.

#### `POST /token`

Genera un `access_token` y un `refresh_token` para el usuario configurado.

```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### `POST /token/refresh`

Refresca el token de acceso usando un `refresh_token` válido.

```json
{
  "refresh_token": "<refresh_token>"
}
```

## Frontend

### Características

- Login con React consumiendo `POST /token`
- Almacenamiento de sesión en `sessionStorage`
- Ruta protegida `/welcome`
- Redirección automática al login si no existe sesión
- Estilos alineados al documento `Compliance-Platform-DESIGN.md`

### Instalación y ejecución local

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://127.0.0.1:5173`.

### Configuración opcional

El frontend consume el backend en `http://127.0.0.1:8000` por defecto. Si necesitás otro origen, definí la variable `VITE_API_URL` antes de ejecutar Vite.

Ejemplo:

```bash
cd frontend
VITE_API_URL=http://127.0.0.1:8000 npm run dev
```

## Flujo de uso

1. Iniciar el backend.
2. Iniciar el frontend.
3. Abrir `http://127.0.0.1:5173`.
4. Ingresar con `admin` / `admin123`.
5. La aplicación guarda el token en `sessionStorage` y redirige a `/welcome`.
6. Si se intenta abrir `/welcome` sin sesión, la aplicación vuelve al login.

## Variables de entorno del backend

- `JWT_SECRET_KEY`: clave secreta para firmar JWT
- `AUTH_USERNAME`: usuario permitido para el login (`admin`)
- `AUTH_PASSWORD`: contraseña permitida para el login (`admin123`)
- `ACCESS_TOKEN_EXPIRE_SECONDS`: duración del access token (por defecto `300`)
- `REFRESH_TOKEN_EXPIRE_SECONDS`: duración del refresh token (por defecto `900`)

## Docker

```bash
cd backend
cp .env.example .env
docker compose up --build
```

## Documentación automática del backend

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`
