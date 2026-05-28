const User = require("../models/User");

exports.list = async (req, res) => {
  const users = await User.find().select("-contrasena").sort({ fecha_registro: -1 });
  res.json(users);
};

exports.get = async (req, res) => {
  const u = await User.findById(req.params.id).select("-contrasena");
  if (!u) return res.status(404).json({ message: "No encontrado" });
  res.json(u);
};

exports.update = async (req, res) => {
  const allowed = ["telefono","estado","rol","nombre_completo"];
  const payload = {};
  for (const k of allowed) if (req.body[k] !== undefined) payload[k] = req.body[k];

  const u = await User.findByIdAndUpdate(req.params.id, payload, { new: true }).select("-contrasena");
  if (!u) return res.status(404).json({ message: "No encontrado" });
  res.json(u);
};
