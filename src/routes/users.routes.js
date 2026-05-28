const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const ctrl = require("../controllers/users.controller");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios (solo administrador)
 *
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por id (admin)
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
 *
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario (admin)
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
 *     responses:
 *       200: { description: OK }
 *       404: { description: No encontrado }
 */

router.get("/", auth, requireRole("administrador"), ctrl.list);
router.get("/:id", auth, requireRole("administrador"), ctrl.get);
router.put("/:id", auth, requireRole("administrador"), ctrl.update);

module.exports = router;