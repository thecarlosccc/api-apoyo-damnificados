# API - Sistema de Gestión para Apoyo a Damnificados (TCC)

Backend en **Node.js + Express + MongoDB** con **Swagger** y **JWT**, orientado a gestionar:
- Usuarios (roles: administrador, donante, damnificado)
- Damnificados
- Donantes
- Donaciones (inventario de ayudas)
- Puntos de interés (albergues/centros/puntos de entrega)
- Notificaciones

> Nota: para el **“catálogo de productos”**, este proyecto considera una **donación disponible** como un **producto**. Por eso existe el endpoint público `/api/productos`.

api-apoyo-damnificados/
  backend/                 (API Node/Express + Swagger + MongoDB)
    server.js
    src/
    package.json
    package-lock.json
    .env.example
    README.md              (opcional, solo backend)
  frontend/                (React + Vite)
    src/
    package.json
    package-lock.json
    .env.example
    README.md              (opcional, solo frontend)
  README.md                (principal: explica cómo ejecutar ambos)
  .gitignore               (único, en la raíz)

---

## Requisitos
- Node.js 18+ (recomendado 20+)
- MongoDB Atlas (o MongoDB local)

## Instalación
```bash
npm install
```

## Variables de entorno
Crea `.env` (NO se sube a GitHub). Usa `.env.example` como guía.

## Ejecutar
```bash
npm run dev
```

API: `http://127.0.0.1:3000`  
Swagger: `http://127.0.0.1:3000/api-docs`

---

## Endpoints clave
### Catálogo público
- `GET /api/productos` → lista donaciones **disponibles** como “productos”
- `GET /api/puntos-interes` → lista puntos de interés (público)

### Autenticación (JWT)
- `POST /api/auth/login` → devuelve `{ token, user }`

### Rutas protegidas
En Swagger, primero usa **Authorize** y pega el token (sin comillas). Luego prueba endpoints con candado.

---

## Seguridad
<<<<<<< HEAD
No se puede publicar `.env` ni credenciales de MongoDB Atlas.


Opcional para ejecutar sin Atlas
README un ejemplo alterno con Mongo local:
MONGO_URI=mongodb://127.0.0.1:27017/db_apoyo_damnificados
=======
- No publiques `.env` ni credenciales.
- Revisa que `.env` esté en `.gitignore`.
>>>>>>> 32600ef (Update backend and add frontend)
