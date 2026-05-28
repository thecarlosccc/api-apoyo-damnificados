const PuntoInteres = require("../models/PuntoInteres");

exports.list = async (req, res) => {
  const items = await PuntoInteres.find().sort({ fecha_actualizacion: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  const item = await PuntoInteres.create(req.body);
  res.status(201).json(item);
};

exports.update = async (req, res) => {
  const item = await PuntoInteres.findByIdAndUpdate(
    req.params.id,
    { ...req.body, fecha_actualizacion: new Date() },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
};
