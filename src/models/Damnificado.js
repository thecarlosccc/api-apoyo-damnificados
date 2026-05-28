const mongoose = require("mongoose");

const geoPoint = {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: [0,0] } // [lng, lat]
};

const damnificadoSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  registrado_por: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  ubicacion: {
    departamento: { type: String, required: true },
    municipio: { type: String, required: true },
    vereda_sector: { type: String },
    direccion: { type: String },
    geolocalizacion: geoPoint
  },

  datos_familiares: {
    cantidad_personas: { type: Number, default: 1 },
    descripcion_personas: { type: String }
  },

  afectaciones: {
    vivienda: { type: String },
    bienes_materiales: { type: String },
    perdida_agricola_ganadera: { type: Boolean, default: false },
    detalle_perdidas: { type: String },
    mascotas_afectadas: { type: Boolean, default: false },
    cantidad_mascotas: { type: Number, default: 0 }
  },

  necesidades_urgentes: { type: [String], default: [] },
  evidencias: { type: [String], default: [] },
  estado_solicitud: { type: String, enum: ["pendiente","en_proceso","atendida","cerrada"], default: "pendiente" },
  fecha_registro: { type: Date, default: Date.now }
}, { timestamps: true });

damnificadoSchema.index({ "ubicacion.geolocalizacion": "2dsphere" });

module.exports = mongoose.model("Damnificado", damnificadoSchema);
