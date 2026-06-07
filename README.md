# TCC — Sistema de Apoyo a Damnificados

Proyecto desarrollado para el Trabajo Colaborativo Contextualizado (TCC) de **Desarrollo de Software Web**.

## Tecnologías

* **Backend:** Node.js + Express + MongoDB + Swagger (OpenAPI) + JWT
* **Frontend:** React + Vite (carpeta `/frontend`)
* **Base de datos:** MongoDB Atlas (recomendado) o MongoDB local

## ¿Qué hace el sistema?

La aplicación permite gestionar:

* Usuarios (roles: **administrador**, **donante**, **damnificado**)
* Donantes y su perfil
* Damnificados y su estado de solicitud
* Donaciones (inventario de ayudas)
* Puntos de interés (albergues, puntos de acopio, etc.)
* Notificaciones

> Nota (catálogo de productos): Para cumplir la idea de “catálogo”, el sistema considera una \*\*donación disponible\*\* como un \*\*producto\*\* mostrado en un catálogo público. Por eso existe el endpoint público `/api/productos`.

\---

## Estructura del repositorio

* **Backend (API):** está en la **raíz del repositorio**
* **Frontend (React):** está en la carpeta **`/frontend`**

```
api-apoyo-damnificados/
  server.js
  src/
  package.json
  package-lock.json
  .env.example
  README.md
  frontend/
    package.json
    package-lock.json
    vite.config.js
    .env.example
    src/
```

\---

## Requisitos

* Node.js 18+ (recomendado 20+)
* MongoDB Atlas (o MongoDB local)

\---

## Configuración de variables de entorno

### 1\) Backend (raíz del repo)

Crea un archivo **`.env`** en la raíz (NO se sube a GitHub). Usa `.env.example` como guía.

Ejemplo:

```
PORT=3000
MONGO\_URI=TU\_URI\_DE\_MONGODB\_ATLAS
JWT\_SECRET=\*\*\*\*\*\*
CORS\_ORIGIN=http://localhost:5173
```

Importante:

* **No publicamos `.env` ni credenciales de MongoDB Atlas.**
* Nos aseguramos que `.env` esté en `.gitignore`.

Opcional (MongoDB local):

```
MONGO\_URI=mongodb://127.0.0.1:27017/db\_apoyo\_damnificados
```

### 2\) Frontend (carpeta /frontend)

Crea **`frontend/.env`** (NO se sube). Usa `frontend/.env.example` como guía.

Ejemplo:

```
VITE\_API\_BASE=http://127.0.0.1:3000
```

\---

## Cómo ejecutar el proyecto (paso a paso)

### A) Ejecutar BACKEND (API) — puerto 3000

En la **raíz del repo** (donde está `server.js`):

```bash
npm install
npm run dev
```

* API: http://127.0.0.1:3000
* Swagger: http://127.0.0.1:3000/api-docs

### B) Ejecutar FRONTEND (React) — puerto 5173

En la carpeta **frontend**:

```bash
cd frontend
npm install
npm run dev
```

* Frontend: http://localhost:5173

\---

## Swagger + JWT (cómo autenticarse)

1. En Swagger entra al endpoint:
* `POST /api/auth/login`
2. Ejecuta el login y copia el valor del campo `token` que retorna.
3. Presiona **Authorize** (arriba a la derecha) y pega:

**Solo el token** (sin comillas, sin escribir “Bearer”).

Swagger enviará el header automáticamente:
`Authorization: Bearer <token>`

\---

## Endpoints clave

### Catálogo público

* `GET /api/productos` → lista donaciones disponibles como “productos”
* `GET /api/puntos-interes` → lista puntos de interés (público)

### Autenticación

* `POST /api/auth/register` → registra donante (autoregistro)
* `POST /api/auth/login` → devuelve `{ token, user }`
* `POST /api/auth/register-damnificado` → crear damnificado (solo admin)

### Panel administrativo (requiere rol admin)

* `/api/users` → gestionar usuarios (roles/estado)
* `/api/damnificados` → listar y administrar damnificados
* `/api/donantes` → listar y administrar donantes
* `/api/donaciones` → administrar donaciones
* `/api/puntos-interes` → administrar puntos de interés
* `/api/notificaciones` → ver y marcar notificaciones

\---

## Seguridad

* Autenticación por **JWT**.
* Rutas protegidas por rol (`administrador`, `donante`, `damnificado`).
* `.env` y credenciales **NO** se suben a GitHub (solo `.env.example`).

\---

## Nota final

El proyecto está dividido claramente en:

* **Backend (raíz)**
* **Frontend (carpeta `/frontend`)**

Esto permite clonar un solo repositorio y ejecutar ambos componentes.

