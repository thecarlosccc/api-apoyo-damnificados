const router = require("express").Router();
const Donacion = require("../models/Donacion");

/**
 * Alias de "Donaciones" para cumplir el requerimiento de "Productos".
 * En este TCC, una donación disponible se considera un producto del catálogo.
 */

/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: Catálogo público de productos (donaciones disponibles)
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Listar productos disponibles (catálogo público)
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", async (req, res) => {
  try {
    const items = await Donacion.find({ estado: "disponible" })
      .select("tipo_donacion descripcion cantidad unidad_medida ubicacion_entrega estado fecha_oferta")
      .sort({ fecha_oferta: -1 });

    return res.json(items);
  } catch (err) {
    console.error("productos (catalogo):", err);
    return res.status(500).json({ message: "Error consultando productos" });
  }
});

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID (catálogo público)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 */
router.get("/:id", async (req, res) => {
  try {
    const doc = await Donacion.findById(req.params.id)
      .select("tipo_donacion descripcion cantidad unidad_medida ubicacion_entrega estado fecha_oferta");

    if (!doc) return res.status(404).json({ message: "Producto no encontrado" });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ message: "ID inválido" });
  }
});

module.exports = router;
