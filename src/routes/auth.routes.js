const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const ctrl = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticación y registro de usuarios
 *
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar donante (autoregistro)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo_documento, numero_documento, nombre_completo, correo, telefono, contrasena]
 *             properties:
 *               tipo_documento: { type: string, example: "CC" }
 *               numero_documento: { type: string, example: "123456789" }
 *               nombre_completo: { type: string, example: "Donante Prueba" }
 *               correo: { type: string, example: "donante@test.com" }
 *               telefono: { type: string, example: "3000000000" }
 *               contrasena: { type: string, example: "Donante123*" }
 *               rol: { type: string, example: "donante" }
 *     responses:
 *       201: { description: Creado }
 *       400: { description: Error de validación }
 *
 * /api/auth/register-damnificado:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar damnificado (solo administrador)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo_documento, numero_documento, nombre_completo, correo, telefono, contrasena]
 *             properties:
 *               tipo_documento: { type: string, example: "CC" }
 *               numero_documento: { type: string, example: "987654321" }
 *               nombre_completo: { type: string, example: "Damnificado Prueba" }
 *               correo: { type: string, example: "damnificado@test.com" }
 *               telefono: { type: string, example: "3001112233" }
 *               contrasena: { type: string, example: "Damnificado123*" }
 *               rol: { type: string, example: "dammificado" }
 *     responses:
 *       201: { description: Creado }
 *       401: { description: No autorizado }
 *       403: { description: Prohibido }
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión (correo o documento)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, contrasena]
 *             properties:
 *               login: { type: string, example: "admin@demo.com" }
 *               contrasena: { type: string, example: "Admin123*" }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Credenciales inválidas }
 */

router.post("/register", ctrl.register);
router.post("/register-damnificado", auth, requireRole("administrador"), ctrl.registerDamnificado);
router.post("/login", ctrl.login);

module.exports = router;