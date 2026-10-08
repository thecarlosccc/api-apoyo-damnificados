const express = require("express");

const router = express.Router();

const {
  auth,
  requireRole,
  requireMaster
} = require("../middlewares/auth");

const ctrl =
  require("../controllers/users.controller");


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestión y administración de usuarios
 */


/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Listar todos los usuarios
 *     description: Disponible únicamente para usuarios con rol administrador.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: No autorizado
 */
router.get(
  "/",
  auth,
  requireRole("administrador"),
  ctrl.list
);


/**
 * @swagger
 * /api/users/administradores:
 *   post:
 *     tags: [Users]
 *     summary: Crear un nuevo administrador
 *     description: Esta operación solo puede ser realizada por el administrador principal o usuario master.
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               tipo_documento:
 *                 type: string
 *                 enum:
 *                   - CC
 *                   - TI
 *                   - CE
 *                   - NIT
 *                 example: "CC"
 *               numero_documento:
 *                 type: string
 *                 example: "100000010"
 *               nombre_completo:
 *                 type: string
 *                 example: "Administrador Secundario"
 *               correo:
 *                 type: string
 *                 example: "admin2@test.com"
 *               telefono:
 *                 type: string
 *                 example: "3000000010"
 *               contrasena:
 *                 type: string
 *                 example: "Admin123*"
 *     responses:
 *       201:
 *         description: Administrador creado correctamente
 *       400:
 *         description: Campos incompletos
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: Operación exclusiva del administrador master
 *       409:
 *         description: Correo o documento ya registrado
 */
router.post(
  "/administradores",
  auth,
  requireMaster,
  ctrl.createAdmin
);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Consultar un usuario por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  "/:id",
  auth,
  requireRole("administrador"),
  ctrl.get
);


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar un usuario
 *     description: Los administradores pueden actualizar datos básicos. Solo el master puede modificar roles.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum:
 *                   - activo
 *                   - inactivo
 *               rol:
 *                 type: string
 *                 enum:
 *                   - donante
 *                   - damnificado
 *                   - administrador
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: Operación no permitida
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  "/:id",
  auth,
  requireRole("administrador"),
  ctrl.update
);


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Desactivar un usuario
 *     description: Realiza eliminación lógica cambiando el estado del usuario a inactivo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: Operación no permitida
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
  "/:id",
  auth,
  requireRole("administrador"),
  ctrl.remove
);


module.exports = router;