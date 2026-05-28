const Donante = require("../models/Donante");

exports.list = async (req, res) => {
  const items = await Donante.find()
    .populate("usuario_id", "nombre_completo correo telefono")
    .sort({ fecha_registro: -1 });
  res.json(items);
};

exports.my = async (req, res) => {
  const item = await Donante.findOne({ usuario_id: req.user._id })
    .populate("usuario_id", "nombre_completo correo telefono");
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};

exports.updateMy = async (req, res) => {
  const item = await Donante.findOneAndUpdate({ usuario_id: req.user._id }, req.body, { new: true, upsert: true });
  res.json(item);
};
