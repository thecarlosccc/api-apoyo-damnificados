const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  tipo_documento: { type: String, enum: ["CC","TI","CE","NIT"], required: true },
  numero_documento: { type: String, required: true, unique: true, index: true },
  nombre_completo: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ["donante","dammificado","administrador"], required: true },
  estado: { type: String, enum: ["activo","inactivo"], default: "activo" },
  fecha_registro: { type: Date, default: Date.now },
  ultimo_acceso: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
