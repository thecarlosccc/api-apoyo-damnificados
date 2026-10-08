const express = require("express");

const router = express.Router();

const {
  auth,
  requireRole
} = require("../middlewares/auth");

const ctrl = require("../controllers/categorias.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaIncidencia:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 68d000000000000000000001
 *         nombre:
 *           type: string
 *           example: Inundación
 *         descripcion:
 *           type: string
 *           example: Afectaciones ocasionadas por acumulación o desbordamiento de agua.
 *         estado:
 *           type: string
 *           enum:
 *             - activo
 *             - inactivo
 *           example: activo
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Listar categorías de incidencias
 *     tags:
 *       - Categorías de Incidencias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al consultar las categorías
 */
router.get(
  "/",
  auth,
  ctrl.listar
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Consultar una categoría por ID
 *     tags:
 *       - Categorías de Incidencias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al consultar la categoría
 */
router.get(
  "/:id",
  auth,
  ctrl.obtenerPorId
);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una categoría de incidencia
 *     tags:
 *       - Categorías de Incidencias
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Inundación
 *               descripcion:
 *                 type: string
 *                 example: Afectaciones ocasionadas por acumulación o desbordamiento de agua.
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       400:
 *         description: Nombre y descripción son obligatorios
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       409:
 *         description: Ya existe una categoría con ese nombre
 *       500:
 *         description: Error al crear la categoría
 */
router.post(
  "/",
  auth,
  requireRole("administrador"),
  ctrl.crear
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría de incidencia
 *     tags:
 *       - Categorías de Incidencias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Inundación
 *               descripcion:
 *                 type: string
 *                 example: Afectaciones ocasionadas por inundaciones o desbordamientos.
 *               estado:
 *                 type: string
 *                 enum:
 *                   - activo
 *                   - inactivo
 *                 example: activo
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       400:
 *         description: Estado no válido
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: Ya existe otra categoría con ese nombre
 *       500:
 *         description: Error al actualizar la categoría
 */
router.put(
  "/:id",
  auth,
  requireRole("administrador"),
  ctrl.actualizar
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Desactivar una categoría de incidencia
 *     description: Realiza una eliminación lógica cambiando el estado de la categoría a inactivo.
 *     tags:
 *       - Categorías de Incidencias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría desactivada correctamente
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al desactivar la categoría
 */
router.delete(
  "/:id",
  auth,
  requireRole("administrador"),
  ctrl.eliminar
);

module.exports = router;