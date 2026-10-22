const express = require("express");

const router = express.Router();

const {
  auth,
  requireRole
} = require("../middlewares/auth");

const ctrl = require(
  "../controllers/solicitudesApoyo.controller"
);

/**
 * @swagger
 * tags:
 *   - name: Solicitudes de Apoyo
 *     description: Registro, consulta y seguimiento de solicitudes de apoyo comunitario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudApoyo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *
 *         usuario_id:
 *           type: string
 *
 *         incidencia_id:
 *           type: string
 *           nullable: true
 *
 *         tipo_apoyo:
 *           type: string
 *           example: Alimentos
 *
 *         descripcion:
 *           type: string
 *           example: Se requieren alimentos no perecederos para una familia afectada por inundación.
 *
 *         cantidad_requerida:
 *           type: number
 *           example: 4
 *
 *         unidad_medida:
 *           type: string
 *           example: kits
 *
 *         prioridad:
 *           type: string
 *           enum:
 *             - baja
 *             - media
 *             - alta
 *             - critica
 *           example: alta
 *
 *         estado:
 *           type: string
 *           enum:
 *             - pendiente
 *             - en_proceso
 *             - atendida
 *             - cancelada
 *           example: pendiente
 *
 *         observacion_admin:
 *           type: string
 *           example: Solicitud en proceso de asignación.
 *
 *         fecha_solicitud:
 *           type: string
 *           format: date-time
 *
 *         fecha_atencion:
 *           type: string
 *           format: date-time
 *           nullable: true
 */


/**
 * @swagger
 * /api/solicitudes-apoyo:
 *   post:
 *     summary: Registrar una solicitud de apoyo
 *     description: Permite a un damnificado registrar una necesidad de apoyo comunitario.
 *     tags:
 *       - Solicitudes de Apoyo
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_apoyo
 *               - descripcion
 *
 *             properties:
 *               incidencia_id:
 *                 type: string
 *                 nullable: true
 *                 example: 6ad97966fa9bb33717ac4912
 *
 *               tipo_apoyo:
 *                 type: string
 *                 example: Alimentos
 *
 *               descripcion:
 *                 type: string
 *                 example: Se requieren kits de alimentos para las personas afectadas en la vivienda.
 *
 *               cantidad_requerida:
 *                 type: number
 *                 example: 4
 *
 *               unidad_medida:
 *                 type: string
 *                 example: kits
 *
 *               prioridad:
 *                 type: string
 *                 enum:
 *                   - baja
 *                   - media
 *                   - alta
 *                   - critica
 *                 example: alta
 *
 *     responses:
 *       201:
 *         description: Solicitud registrada correctamente
 *
 *       400:
 *         description: Datos incompletos o incidencia no válida
 *
 *       401:
 *         description: Usuario no autenticado
 *
 *       403:
 *         description: Usuario sin rol de damnificado
 *
 *       500:
 *         description: Error al registrar la solicitud
 */
router.post(
  "/",
  auth,
  requireRole("damnificado"),
  ctrl.crear
);


/**
 * @swagger
 * /api/solicitudes-apoyo:
 *   get:
 *     summary: Listar todas las solicitudes de apoyo
 *     description: Disponible para administradores. Permite aplicar filtros opcionales.
 *     tags:
 *       - Solicitudes de Apoyo
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: estado
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - pendiente
 *             - en_proceso
 *             - atendida
 *             - cancelada
 *
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
 *
 *       - in: query
 *         name: tipo_apoyo
 *         required: false
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *
 *       401:
 *         description: Usuario no autenticado
 *
 *       403:
 *         description: Usuario sin permisos de administrador
 *
 *       500:
 *         description: Error al consultar las solicitudes
 */
router.get(
  "/",
  auth,
  requireRole("administrador"),
  ctrl.listar
);


/**
 * @swagger
 * /api/solicitudes-apoyo/mias:
 *   get:
 *     summary: Consultar mis solicitudes de apoyo
 *     description: Permite al damnificado consultar únicamente sus propias solicitudes.
 *     tags:
 *       - Solicitudes de Apoyo
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Solicitudes del usuario autenticado
 *
 *       401:
 *         description: Usuario no autenticado
 *
 *       403:
 *         description: Usuario sin rol de damnificado
 *
 *       500:
 *         description: Error al consultar las solicitudes
 */
router.get(
  "/mias",
  auth,
  requireRole("damnificado"),
  ctrl.listarMias
);


/**
 * @swagger
 * /api/solicitudes-apoyo/{id}:
 *   get:
 *     summary: Consultar una solicitud por ID
 *     description: El administrador puede consultar cualquier solicitud. El damnificado solamente puede consultar las propias.
 *     tags:
 *       - Solicitudes de Apoyo
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *
 *       401:
 *         description: Usuario no autenticado
 *
 *       403:
 *         description: Usuario sin autorización
 *
 *       404:
 *         description: Solicitud no encontrada
 *
 *       500:
 *         description: Error al consultar la solicitud
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
 * /api/solicitudes-apoyo/{id}:
 *   put:
 *     summary: Actualizar una solicitud propia
 *     description: El damnificado puede modificar una solicitud mientras permanezca pendiente.
 *     tags:
 *       - Solicitudes de Apoyo
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               incidencia_id:
 *                 type: string
 *                 nullable: true
 *
 *               tipo_apoyo:
 *                 type: string
 *                 example: Alimentos
 *
 *               descripcion:
 *                 type: string
 *                 example: Se requieren alimentos y agua potable.
 *
 *               cantidad_requerida:
 *                 type: number
 *                 example: 5
 *
 *               unidad_medida:
 *                 type: string
 *                 example: kits
 *
 *               prioridad:
 *                 type: string
 *                 enum:
 *                   - baja
 *                   - media
 *                   - alta
 *                   - critica
 *
 *     responses:
 *       200:
 *         description: Solicitud actualizada correctamente
 *
 *       400:
 *         description: Datos no válidos o solicitud no editable
 *
 *       401:
 *         description: Usuario no autenticado
 *
 *       403:
 *         description: Usuario sin rol de damnificado
 *
 *       404:
 *         description: Solicitud no encontrada
 *
 *       500:
 *         description: Error al actualizar la solicitud
 */
router.put(
  "/:id",
  auth,
  requireRole("damnificado"),
  ctrl.actualizarMia
);


/**
 * @swagger
 * /api/solicitudes-apoyo/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una solicitud propia
 *     description: Permite al damnificado cancelar una solicitud mientras no haya sido atendida.
 *     tags:
 *       - Solicitudes de Apoyo
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Solicitud cancelada correctamente
 *
 *       400:
 *         description: La solicitud ya fue atendida
 *
 *       401:
 *         description: Usuario no autenticado
 *
 *       403:
 *         description: Usuario sin rol de damnificado
 *
 *       404:
 *         description: Solicitud no encontrada
 *
 *       500:
 *         description: Error al cancelar la solicitud
 */
router.patch(
  "/:id/cancelar",
  auth,
  requireRole("damnificado"),
  ctrl.cancelarMia
);


/**
 * @swagger
 * /api/solicitudes-apoyo/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de una solicitud
 *     description: Permite al administrador realizar seguimiento a una solicitud de apoyo.
 *     tags:
 *       - Solicitudes de Apoyo
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *
 *             properties:
 *               estado:
 *                 type: string
 *                 enum:
 *                   - pendiente
 *                   - en_proceso
 *                   - atendida
 *                   - cancelada
 *                 example: en_proceso
 *
 *               observacion_admin:
 *                 type: string
 *                 example: Se está coordinando la entrega de la ayuda.
 *
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *
 *       400:
 *         description: Estado no válido
 *
 *       401:
 *         description: Usuario no autenticado
 *
 *       403:
 *         description: Usuario sin permisos de administrador
 *
 *       404:
 *         description: Solicitud no encontrada
 *
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