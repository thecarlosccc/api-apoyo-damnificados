const mongoose = require("mongoose");

const donacionSchema = new mongoose.Schema({
  donante_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donante", required: true },
  tipo_donacion: { type: String, enum: ["dinero","alimentos","medicamentos","ropa","albergue","otros"], required: true },
  descripcion: { type: String, required: true },
  cantidad: { type: Number, default: 1 },
  unidad_medida: { type: String, default: "unidades" },
  ubicacion_entrega: { type: String },
  estado: { type: String, enum: ["disponible","asignada","entregada","cancelada"], default: "disponible" },
  asignado_a: { type: mongoose.Schema.Types.ObjectId, ref: "Damnificado" },
  fecha_oferta: { type: Date, default: Date.now },
  fecha_entrega: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Donacion", donacionSchema);
