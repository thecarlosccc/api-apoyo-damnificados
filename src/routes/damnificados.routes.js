const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const ctrl = require("../controllers/damnificados.controller");

/**
 * @swagger
 * tags:
 *   - name: Damnificados
 *     description: Gestión de damnificados
 *
 * /api/damnificados:
 *   get:
 *     tags: [Damnificados]
 *     summary: Listar damnificados (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *
 * /api/damnificados/me:
 *   get:
 *     tags: [Damnificados]
 *     summary: Ver mi perfil de damnificado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *
 *   put:
 *     tags: [Damnificados]
 *     summary: Actualizar mi perfil de damnificado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: OK }
 *
 * /api/damnificados/{id}/estado:
 *   patch:
 *     tags: [Damnificados]
 *     summary: Cambiar estado de solicitud (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado_solicitud: { type: string, example: "verificado" }
 *     responses:
 *       200: { description: OK }
 */

router.get("/", auth, requireRole("administrador"), ctrl.list);
router.get("/me", auth, requireRole("dammificado"), ctrl.my);
router.put("/me", auth, requireRole("dammificado"), ctrl.updateMy);
router.patch("/:id/estado", auth, requireRole("administrador"), ctrl.updateEstado);

module.exports = router;