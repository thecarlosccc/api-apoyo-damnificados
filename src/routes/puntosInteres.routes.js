const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const ctrl = require("../controllers/puntosInteres.controller");

/**
 * @swagger
 * tags:
 *   - name: PuntosInteres
 *     description: Puntos de interés (albergues, centros, etc.)
 *
 * /api/puntos-interes:
 *   get:
 *     tags: [PuntosInteres]
 *     summary: Listar puntos de interés (público)
 *     responses:
 *       200: { description: OK }
 *
 *   post:
 *     tags: [PuntosInteres]
 *     summary: Crear punto de interés (admin)
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
 * /api/puntos-interes/{id}:
 *   put:
 *     tags: [PuntosInteres]
 *     summary: Actualizar punto de interés (admin)
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
 *       404: { description: No encontrado }
 */

router.get("/", ctrl.list);
router.post("/", auth, requireRole("administrador"), ctrl.create);
router.put("/:id", auth, requireRole("administrador"), ctrl.update);

module.exports = router;