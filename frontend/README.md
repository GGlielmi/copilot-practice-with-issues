# Frontend de autenticación

Aplicación React creada con Vite para consumir el backend FastAPI del repositorio. Incluye:

- pantalla de login conectada a `POST /token`
- persistencia del token en `sessionStorage`
- página de bienvenida protegida en `/welcome`
- cierre de sesión local

## Uso

```bash
npm install
npm run dev
```

Por defecto consume `http://127.0.0.1:8000`. Para cambiarlo, definir `VITE_API_URL`.
