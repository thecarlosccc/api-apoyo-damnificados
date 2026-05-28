const mongoose = require("mongoose");

const geoPoint = {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: [0,0] }
};

const puntoInteresSchema = new mongoose.Schema({
  tipo: { type: String, enum: ["zona_afectada","punto_acopio","albergue","centro_atencion_animal"], required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  direccion: { type: String },
  contacto_responsable: {
    nombre: { type: String },
    telefono: { type: String }
  },
  geolocalizacion: geoPoint,
  capacidad_maxima: { type: Number },
  recursos_disponibles: { type: [String], default: [] },
  estado: { type: String, enum: ["activo","lleno","inactivo"], default: "activo" },
  fecha_actualizacion: { type: Date, default: Date.now }
}, { timestamps: true });

puntoInteresSchema.index({ geolocalizacion: "2dsphere" });

module.exports = mongoose.model("PuntoInteres", puntoInteresSchema);
