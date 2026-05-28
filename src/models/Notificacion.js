const mongoose = require("mongoose");

const notificacionSchema = new mongoose.Schema({
  usuario_destino_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mensaje: { type: String, required: true },
  tipo: { type: String, enum: ["solicitud_atendida","necesidades_cercanas","alerta_general"], default: "alerta_general" },
  leido: { type: Boolean, default: false },
  fecha_envio: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Notificacion", notificacionSchema);
