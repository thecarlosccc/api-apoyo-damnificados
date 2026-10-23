const express = require("express");

const router = express.Router();

const {
  auth
} = require("../middlewares/auth");

const ctrl = require(
  "../controllers/notificaciones.controller"
);


/**
 * @swagger
 * tags:
 *   - name: Notificaciones
 *     description: Consulta y gestión de notificaciones del usuario autenticado
 */


/**
 * @swagger
 * /api/notificaciones/me:
 *   get:
 *     summary: Consultar mis notificaciones
 *     description: >
 *       Permite al usuario autenticado consultar sus notificaciones.
 *       Puede filtrar por estado de lectura y tipo.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: leido
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filtra por notificaciones leídas o no leídas.
 *
 *       - in: query
 *         name: tipo
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - solicitud_atendida
 *             - necesidades_cercanas
 *             - alerta_general
 *             - incidencia_estado
 *             - solicitud_estado
 *             - donacion_asignada
 *             - donacion_entregada
 *             - perfil_damnificado
 *
 *     responses:
 *       200:
 *         description: Notificaciones del usuario
 *       400:
 *         description: Parámetro de filtro inválido
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al consultar las notificaciones
 */
router.get(
  "/me",
  auth,
  ctrl.my
);


/**
 * @swagger
 * /api/notificaciones/leer-todas:
 *   patch:
 *     summary: Marcar todas mis notificaciones como leídas
 *     description: >
 *       Marca como leídas todas las notificaciones pendientes
 *       del usuario autenticado.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Notificaciones actualizadas correctamente
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al actualizar las notificaciones
 */
router.patch(
  "/leer-todas",
  auth,
  ctrl.markAllRead
);


/**
 * @swagger
 * /api/notificaciones/{id}/read:
 *   patch:
 *     summary: Marcar una notificación como leída
 *     description: >
 *       Permite al usuario autenticado marcar como leída
 *       una notificación que le pertenece.
 *     tags:
 *       - Notificaciones
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
 *         description: Notificación marcada como leída
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error al actualizar la notificación
 */
router.patch(
  "/:id/read",
  auth,
  ctrl.markRead
);


module.exports = router;