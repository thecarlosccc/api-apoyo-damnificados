const express = require("express");

const router = express.Router();

const {
  auth,
  requireRole
} = require("../middlewares/auth");

const ctrl = require(
  "../controllers/incidencias.controller"
);

/**
 * @swagger
 * tags:
 *   - name: Incidencias
 *     description: Registro, consulta y seguimiento de incidencias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Incidencia:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         usuario_id:
 *           type: string
 *         categoria_id:
 *           type: string
 *         titulo:
 *           type: string
 *           example: Vivienda afectada por inundación
 *         descripcion:
 *           type: string
 *           example: El agua ingresó a la vivienda y afectó varios enseres.
 *         ubicacion:
 *           type: string
 *           example: Barrio La Esperanza, Montería
 *         geolocalizacion:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: Point
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example:
 *                 - -75.8814
 *                 - 8.7479
 *         evidencias:
 *           type: array
 *           items:
 *             type: string
 *         nivel_prioridad:
 *           type: string
 *           enum:
 *             - baja
 *             - media
 *             - alta
 *             - critica
 *           example: alta
 *         estado:
 *           type: string
 *           enum:
 *             - pendiente
 *             - en_proceso
 *             - resuelta
 *           example: pendiente
 *         fecha_reporte:
 *           type: string
 *           format: date-time
 *         fecha_actualizacion:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/incidencias:
 *   post:
 *     summary: Registrar una nueva incidencia
 *     description: Permite a un usuario damnificado registrar una incidencia.
 *     tags:
 *       - Incidencias
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoria_id
 *               - titulo
 *               - descripcion
 *               - ubicacion
 *             properties:
 *               categoria_id:
 *                 type: string
 *                 example: 68d000000000000000000001
 *               titulo:
 *                 type: string
 *                 example: Vivienda afectada por inundación
 *               descripcion:
 *                 type: string
 *                 example: El agua ingresó a la vivienda y afectó muebles y electrodomésticos.
 *               ubicacion:
 *                 type: string
 *                 example: Barrio La Esperanza, Montería
 *               geolocalizacion:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example:
 *                       - -75.8814
 *                       - 8.7479
 *               evidencias:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               nivel_prioridad:
 *                 type: string
 *                 enum:
 *                   - baja
 *                   - media
 *                   - alta
 *                   - critica
 *                 example: alta
 *     responses:
 *       201:
 *         description: Incidencia registrada correctamente
 *       400:
 *         description: Datos incompletos o categoría no válida
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: El usuario no tiene rol de damnificado
 *       500:
 *         description: Error al registrar la incidencia
 */
router.post(
  "/",
  auth,
  requireRole("damnificado"),
  ctrl.crear
);

/**
 * @swagger
 * /api/incidencias:
 *   get:
 *     summary: Listar todas las incidencias
 *     description: Funcionalidad disponible para administradores. Permite aplicar filtros opcionales.
 *     tags:
 *       - Incidencias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - pendiente
 *             - en_proceso
 *             - resuelta
 *       - in: query
 *         name: prioridad
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - baja
 *             - media
 *             - alta
 *             - critica
 *       - in: query
 *         name: categoria_id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de incidencias
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       500:
 *         description: Error al consultar las incidencias
 */
router.get(
  "/",
  auth,
  requireRole("administrador"),
  ctrl.listar
);

/**
 * @swagger
 * /api/incidencias/mias:
 *   get:
 *     summary: Consultar mis incidencias
 *     description: Permite al damnificado consultar únicamente las incidencias que ha registrado.
 *     tags:
 *       - Incidencias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Incidencias del usuario autenticado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin rol de damnificado
 *       500:
 *         description: Error al consultar las incidencias
 */
router.get(
  "/mias",
  auth,
  requireRole("damnificado"),
  ctrl.listarMias
);

/**
 * @swagger
 * /api/incidencias/{id}:
 *   get:
 *     summary: Consultar una incidencia por ID
 *     description: El administrador puede consultar cualquier incidencia. El damnificado solamente puede consultar una incidencia propia.
 *     tags:
 *       - Incidencias
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
 *         description: Incidencia encontrada
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin autorización
 *       404:
 *         description: Incidencia no encontrada
 *       500:
 *         description: Error al consultar la incidencia
 */
router.get(
  "/:id",
  auth,
  requireRole(
    "administrador",
    "damnificado"
  ),
  ctrl.obtenerPorId
);

/**
 * @swagger
 * /api/incidencias/{id}:
 *   put:
 *     summary: Actualizar una incidencia propia
 *     description: El damnificado puede modificar los datos de una incidencia propia mientras no se encuentre resuelta.
 *     tags:
 *       - Incidencias
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
 *               categoria_id:
 *                 type: string
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               geolocalizacion:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *               evidencias:
 *                 type: array
 *                 items:
 *                   type: string
 *               nivel_prioridad:
 *                 type: string
 *                 enum:
 *                   - baja
 *                   - media
 *                   - alta
 *                   - critica
 *     responses:
 *       200:
 *         description: Incidencia actualizada correctamente
 *       400:
 *         description: Datos no válidos o incidencia resuelta
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin rol de damnificado
 *       404:
 *         description: Incidencia no encontrada
 *       500:
 *         description: Error al actualizar la incidencia
 */
router.put(
  "/:id",
  auth,
  requireRole("damnificado"),
  ctrl.actualizarMia
);

/**
 * @swagger
 * /api/incidencias/{id}/estado:
 *   patch:
 *     summary: Cambiar el estado de una incidencia
 *     description: Permite al administrador realizar el seguimiento de una incidencia.
 *     tags:
 *       - Incidencias
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
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum:
 *                   - pendiente
 *                   - en_proceso
 *                   - resuelta
 *                 example: en_proceso
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado no válido
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Incidencia no encontrada
 *       500:
 *         description: Error al cambiar el estado
 */
router.patch(
  "/:id/estado",
  auth,
  requireRole("administrador"),
  ctrl.cambiarEstado
);

module.exports = router;