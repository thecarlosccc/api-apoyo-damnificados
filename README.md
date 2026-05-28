# API - Sistema de Gestión para Apoyo a Damnificados

Backend en **Node.js + Express + MongoDB** basado en el documento de requisitos y estructura de base de datos.

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

API: http://127.0.0.1:3000  
Swagger: http://127.0.0.1:3000/api-docs

## Seguridad
No se puede publicar `.env` ni credenciales de MongoDB Atlas.
