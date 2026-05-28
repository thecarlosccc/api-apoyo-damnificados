const Notificacion = require("../models/Notificacion");

exports.my = async (req, res) => {
  const items = await Notificacion.find({ usuario_destino_id: req.user._id }).sort({ fecha_envio: -1 });
  res.json(items);
};

exports.markRead = async (req, res) => {
  const item = await Notificacion.findOneAndUpdate(
    { _id: req.params.id, usuario_destino_id: req.user._id },
    { leido: true },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};
