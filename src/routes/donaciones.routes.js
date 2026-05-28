const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const ctrl = require("../controllers/donaciones.controller");

/**
 * @swagger
 * tags:
 *   - name: Donaciones
 *     description: Gestión de donaciones
 *
 * /api/donaciones:
 *   get:
 *     tags: [Donaciones]
 *     summary: Listar donaciones (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *
 *   post:
 *     tags: [Donaciones]
 *     summary: Crear donación (donante)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       201: { description: Creado }
 *
 * /api/donaciones/{id}/asignar:
 *   post:
 *     tags: [Donaciones]
 *     summary: Asignar donación a damnificado (admin)
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
 *           schema: { type: object }
 *     responses:
 *       200: { description: OK }
 *
 * /api/donaciones/{id}/entregar:
 *   post:
 *     tags: [Donaciones]
 *     summary: Marcar donación como entregada (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */

router.get("/", auth, requireRole("administrador"), ctrl.list);
router.post("/", auth, requireRole("donante"), ctrl.create);
router.post("/:id/asignar", auth, requireRole("administrador"), ctrl.assign);
router.post("/:id/entregar", auth, requireRole("administrador"), ctrl.markDelivered);

module.exports = router;