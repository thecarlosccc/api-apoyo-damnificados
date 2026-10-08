const express = require("express");

const router = express.Router();

const ctrl = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticación y registro de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un damnificado o donante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_documento
 *               - numero_documento
 *               - nombre_completo
 *               - correo
 *               - telefono
 *               - contrasena
 *               - rol
 *             properties:
 *               tipo_documento:
 *                 type: string
 *                 example: "CC"
 *               numero_documento:
 *                 type: string
 *                 example: "123456789"
 *               nombre_completo:
 *                 type: string
 *                 example: "Usuario Prueba"
 *               correo:
 *                 type: string
 *                 example: "usuario@test.com"
 *               telefono:
 *                 type: string
 *                 example: "3000000000"
 *               contrasena:
 *                 type: string
 *                 example: "Usuario123*"
 *               rol:
 *                 type: string
 *                 enum:
 *                   - donante
 *                   - damnificado
 *                 example: "damnificado"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos incompletos
 *       403:
 *         description: Rol no permitido
 *       409:
 *         description: Correo o documento ya registrado
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión con correo o número de documento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - contrasena
 *             properties:
 *               login:
 *                 type: string
 *                 example: "admin@demo.com"
 *               contrasena:
 *                 type: string
 *                 example: "Admin123*"
 *     responses:
 *       200:
 *         description: Inicio de sesión correcto
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Credenciales inválidas
 *       403:
 *         description: Cuenta inactiva
 */

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

module.exports = router;