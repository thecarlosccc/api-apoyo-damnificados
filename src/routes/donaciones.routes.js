const express = require("express");

const router = express.Router();

const {
  auth,
  requireRole
} = require("../middlewares/auth");

const ctrl = require(
  "../controllers/donaciones.controller"
);

/**
 * @swagger
 * tags:
 *   - name: Donaciones
 *     description: Registro, consulta, asignación y entrega de donaciones
 */


/**
 * @swagger
 * /api/donaciones/catalogo:
 *   get:
 *     summary: Consultar donaciones disponibles
 *     description: Permite consultar las ayudas disponibles para asignación.
 *     tags:
 *       - Donaciones
 *     responses:
 *       200:
 *         description: Catálogo de donaciones disponibles
 *       500:
 *         description: Error al consultar el catálogo
 */
router.get(
  "/catalogo",
  ctrl.listarCatalogo
);


/**
 * @swagger
 * /api/donaciones:
 *   get:
 *     summary: Listar todas las donaciones
 *     description: Disponible para administradores. Permite aplicar filtros opcionales.
 *     tags:
 *       - Donaciones
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
 *             - disponible
 *             - asignada
 *             - entregada
 *             - cancelada
 *
 *       - in: query
 *         name: tipo
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - dinero
 *             - alimentos
 *             - medicamentos
 *             - ropa
 *             - albergue
 *             - otros
 *
 *     responses:
 *       200:
 *         description: Lista de donaciones
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       500:
 *         description: Error al consultar las donaciones
 */
router.get(
  "/",
  auth,
  requireRole("administrador"),
  ctrl.listar
);


/**
 * @swagger
 * /api/donaciones/mias:
 *   get:
 *     summary: Consultar mis donaciones
 *     description: Permite al usuario donante consultar únicamente las ayudas que ha registrado.
 *     tags:
 *       - Donaciones
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Donaciones del usuario autenticado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin rol de donante
 *       404:
 *         description: Perfil de donante no encontrado
 *       500:
 *         description: Error al consultar las donaciones
 */
router.get(
  "/mias",
  auth,
  requireRole("donante"),
  ctrl.listarMias
);


/**
 * @swagger
 * /api/donaciones:
 *   post:
 *     summary: Registrar una nueva donación
 *     description: Permite a un donante registrar una ayuda disponible.
 *     tags:
 *       - Donaciones
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
 *               - tipo_donacion
 *               - descripcion
 *
 *             properties:
 *               tipo_donacion:
 *                 type: string
 *                 enum:
 *                   - dinero
 *                   - alimentos
 *                   - medicamentos
 *                   - ropa
 *                   - albergue
 *                   - otros
 *                 example: alimentos
 *
 *               descripcion:
 *                 type: string
 *                 example: Kits de alimentos no perecederos y agua potable.
 *
 *               cantidad:
 *                 type: number
 *                 example: 10
 *
 *               unidad_medida:
 *                 type: string
 *                 example: kits
 *
 *               ubicacion_entrega:
 *                 type: string
 *                 example: Centro de acopio principal, Montería
 *
 *     responses:
 *       201:
 *         description: Donación registrada correctamente
 *       400:
 *         description: Datos incompletos, tipo no válido o perfil donante inexistente
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin rol de donante
 *       500:
 *         description: Error al registrar la donación
 */
router.post(
  "/",
  auth,
  requireRole("donante"),
  ctrl.crear
);


/**
 * @swagger
 * /api/donaciones/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una donación propia
 *     description: Permite al donante cancelar una ayuda mientras permanezca disponible.
 *     tags:
 *       - Donaciones
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
 *         description: Donación cancelada correctamente
 *       400:
 *         description: La donación ya no está disponible
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin rol de donante
 *       404:
 *         description: Donación no encontrada
 *       500:
 *         description: Error al cancelar la donación
 */
router.patch(
  "/:id/cancelar",
  auth,
  requireRole("donante"),
  ctrl.cancelarMia
);


/**
 * @swagger
 * /api/donaciones/{id}/asignar:
 *   patch:
 *     summary: Asignar una donación a una solicitud de apoyo
 *     description: Permite al administrador asignar una donación disponible a una solicitud pendiente o en proceso.
 *     tags:
 *       - Donaciones
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
 *               - solicitud_apoyo_id
 *
 *             properties:
 *               solicitud_apoyo_id:
 *                 type: string
 *                 example: 6ad97f0f632e3c698fab33c2
 *
 *     responses:
 *       200:
 *         description: Donación asignada correctamente
 *       400:
 *         description: Donación no disponible o solicitud no válida
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Donación o solicitud no encontrada
 *       500:
 *         description: Error al asignar la donación
 */
router.patch(
  "/:id/asignar",
  auth,
  requireRole("administrador"),
  ctrl.asignar
);


/**
 * @swagger
 * /api/donaciones/{id}/entregar:
 *   patch:
 *     summary: Marcar una donación como entregada
 *     description: Confirma la entrega de una donación asignada y marca automáticamente la solicitud de apoyo como atendida.
 *     tags:
 *       - Donaciones
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
 *         description: Donación entregada correctamente
 *       400:
 *         description: La donación no se encuentra asignada
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Donación no encontrada
 *       500:
 *         description: Error al marcar la donación como entregada
 */
router.patch(
  "/:id/entregar",
  auth,
  requireRole("administrador"),
  ctrl.marcarEntregada
);


module.exports = router;