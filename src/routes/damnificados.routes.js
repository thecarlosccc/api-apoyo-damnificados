const express = require("express");

const router = express.Router();

const {
  auth,
  requireRole
} = require("../middlewares/auth");

const ctrl = require(
  "../controllers/damnificados.controller"
);


/**
 * @swagger
 * tags:
 *   - name: Damnificados
 *     description: Gestión y perfil de usuarios damnificados
 */


/**
 * @swagger
 * /api/damnificados:
 *   get:
 *     summary: Listar todos los damnificados
 *     description: Disponible únicamente para administradores.
 *     tags:
 *       - Damnificados
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de perfiles de damnificados
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       500:
 *         description: Error al consultar los damnificados
 */
router.get(
  "/",
  auth,
  requireRole("administrador"),
  ctrl.list
);


/**
 * @swagger
 * /api/damnificados/me:
 *   get:
 *     summary: Consultar mi perfil de damnificado
 *     description: Permite al usuario damnificado consultar su propio perfil.
 *     tags:
 *       - Damnificados
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Perfil del damnificado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin rol de damnificado
 *       404:
 *         description: El perfil todavía no ha sido creado
 *       500:
 *         description: Error al consultar el perfil
 */
router.get(
  "/me",
  auth,
  requireRole("damnificado"),
  ctrl.my
);


/**
 * @swagger
 * /api/damnificados/me:
 *   put:
 *     summary: Crear o actualizar mi perfil de damnificado
 *     description: >
 *       Si el usuario aún no tiene perfil de damnificado, el sistema lo crea.
 *       Si ya existe, actualiza únicamente los campos permitidos.
 *     tags:
 *       - Damnificados
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               ubicacion:
 *                 type: object
 *                 properties:
 *                   departamento:
 *                     type: string
 *                     example: Córdoba
 *
 *                   municipio:
 *                     type: string
 *                     example: Montería
 *
 *                   vereda_sector:
 *                     type: string
 *                     example: Barrio La Esperanza
 *
 *                   direccion:
 *                     type: string
 *                     example: Calle 10 # 20-30
 *
 *                   geolocalizacion:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: Point
 *
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example:
 *                           - -75.8814
 *                           - 8.7479
 *
 *               datos_familiares:
 *                 type: object
 *                 properties:
 *                   cantidad_personas:
 *                     type: integer
 *                     example: 4
 *
 *                   descripcion_personas:
 *                     type: string
 *                     example: Dos adultos y dos niños
 *
 *               afectaciones:
 *                 type: object
 *                 properties:
 *                   vivienda:
 *                     type: string
 *                     example: Inundación parcial de la vivienda
 *
 *                   bienes_materiales:
 *                     type: string
 *                     example: Muebles y electrodomésticos afectados
 *
 *                   perdida_agricola_ganadera:
 *                     type: boolean
 *                     example: false
 *
 *                   detalle_perdidas:
 *                     type: string
 *                     example: Sin pérdidas agrícolas
 *
 *                   mascotas_afectadas:
 *                     type: boolean
 *                     example: true
 *
 *                   cantidad_mascotas:
 *                     type: integer
 *                     example: 1
 *
 *               necesidades_urgentes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - alimentos
 *                   - agua potable
 *                   - elementos de aseo
 *
 *               evidencias:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       201:
 *         description: Perfil creado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin rol de damnificado
 *       500:
 *         description: Error al guardar el perfil
 */
router.put(
  "/me",
  auth,
  requireRole("damnificado"),
  ctrl.updateMy
);


/**
 * @swagger
 * /api/damnificados/{id}/estado:
 *   patch:
 *     summary: Cambiar estado del perfil de damnificado
 *     description: Permite al administrador actualizar el estado del perfil.
 *     tags:
 *       - Damnificados
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
 *               - estado_solicitud
 *
 *             properties:
 *               estado_solicitud:
 *                 type: string
 *                 enum:
 *                   - pendiente
 *                   - en_proceso
 *                   - atendida
 *                   - cerrada
 *                 example: en_proceso
 *
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado no válido
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Perfil de damnificado no encontrado
 *       500:
 *         description: Error al actualizar el estado
 */
router.patch(
  "/:id/estado",
  auth,
  requireRole("administrador"),
  ctrl.updateEstado
);


module.exports = router;