const Damnificado = require("../models/Damnificado");

exports.list = async (req, res) => {
  const items = await Damnificado.find()
    .populate("usuario_id", "nombre_completo correo telefono")
    .sort({ fecha_registro: -1 });
  res.json(items);
};

exports.my = async (req, res) => {
  const item = await Damnificado.findOne({ usuario_id: req.user._id })
    .populate("usuario_id", "nombre_completo correo telefono");
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};

exports.updateMy = async (req, res) => {
  const item = await Damnificado.findOneAndUpdate({ usuario_id: req.user._id }, req.body, { new: true });
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};

exports.updateEstado = async (req, res) => {
  const { estado_solicitud } = req.body;
  const item = await Damnificado.findByIdAndUpdate(req.params.id, { estado_solicitud }, { new: true });
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};
