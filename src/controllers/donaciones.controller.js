const Donacion = require("../models/Donacion");
const Donante = require("../models/Donante");

// =========================
// CATÁLOGO PÚBLICO
// =========================
// Permite mostrar donaciones disponibles como “productos” en el catálogo del frontend.
// No requiere autenticación.
exports.listarCatalogo = async (req, res) => {
  try {
    const items = await Donacion.find({ estado: "disponible" })
      .select("tipo_donacion descripcion cantidad unidad_medida ubicacion_entrega estado fecha_oferta")
      .sort({ fecha_oferta: -1 });

    return res.json(items);
  } catch (err) {
    console.error("listarCatalogo (donaciones):", err);
    return res.status(500).json({ message: "Error consultando catálogo" });
  }
};

exports.list = async (req, res) => {
  const items = await Donacion.find()
    .populate({ path: "donante_id", populate: { path: "usuario_id", select: "nombre_completo" } })
    .populate({ path: "asignado_a", populate: { path: "usuario_id", select: "nombre_completo" } })
    .sort({ fecha_oferta: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  const donante = await Donante.findOne({ usuario_id: req.user._id });
  if (!donante) return res.status(400).json({ message: "Perfil donante no encontrado" });

  const payload = { ...req.body, donante_id: donante._id };
  const item = await Donacion.create(payload);
  res.status(201).json(item);
};

exports.assign = async (req, res) => {
  const { damnificado_id } = req.body;
  const item = await Donacion.findByIdAndUpdate(
    req.params.id,
    { estado: "asignada", asignado_a: damnificado_id },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};

exports.markDelivered = async (req, res) => {
  const item = await Donacion.findByIdAndUpdate(
    req.params.id,
    { estado: "entregada", fecha_entrega: new Date() },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};
