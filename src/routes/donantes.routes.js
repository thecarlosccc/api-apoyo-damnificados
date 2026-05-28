const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const ctrl = require("../controllers/donantes.controller");

/**
 * @swagger
 * tags:
 *   - name: Donantes
 *     description: Perfil de donantes
 *
 * /api/donantes:
 *   get:
 *     tags: [Donantes]
 *     summary: Listar donantes (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *
 * /api/donantes/me:
 *   get:
 *     tags: [Donantes]
 *     summary: Ver mi perfil de donante
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *
 *   put:
 *     tags: [Donantes]
 *     summary: Actualizar mi perfil de donante
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: OK }
 */

router.get("/", auth, requireRole("administrador"), ctrl.list);
router.get("/me", auth, requireRole("donante"), ctrl.my);
router.put("/me", auth, requireRole("donante"), ctrl.updateMy);

module.exports = router;