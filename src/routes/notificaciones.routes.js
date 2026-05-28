const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const ctrl = require("../controllers/notificaciones.controller");

/**
 * @swagger
 * tags:
 *   - name: Notificaciones
 *     description: Notificaciones por usuario
 *
 * /api/notificaciones/me:
 *   get:
 *     tags: [Notificaciones]
 *     summary: Ver mis notificaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *
 * /api/notificaciones/{id}/read:
 *   patch:
 *     tags: [Notificaciones]
 *     summary: Marcar notificación como leída
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No encontrado }
 */

router.get("/me", auth, ctrl.my);
router.patch("/:id/read", auth, ctrl.markRead);

module.exports = router;