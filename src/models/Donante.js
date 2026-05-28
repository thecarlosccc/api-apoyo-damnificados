const mongoose = require("mongoose");

const geoPoint = {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: [0,0] }
};

const donanteSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  tipo_donante: { type: String, enum: ["persona_natural","empresa","fundacion"], default: "persona_natural" },

  ubicacion_referencia: {
    departamento: { type: String },
    municipio: { type: String },
    geolocalizacion: geoPoint
  },

  capacidades: {
    ofrece_dinero: { type: Boolean, default: false },
    ofrece_alimentos: { type: Boolean, default: false },
    ofrece_medicamentos: { type: Boolean, default: false },
    ofrece_ropa: { type: Boolean, default: false },
    ofrece_albergue: { type: Boolean, default: false },
    detalle_otros: { type: String }
  },

  disponibilidad: { type: String, enum: ["inmediata","programada"], default: "inmediata" },
  fecha_registro: { type: Date, default: Date.now }
}, { timestamps: true });

donanteSchema.index({ "ubicacion_referencia.geolocalizacion": "2dsphere" });

module.exports = mongoose.model("Donante", donanteSchema);
