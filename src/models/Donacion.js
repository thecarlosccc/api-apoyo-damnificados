const mongoose = require("mongoose");

const donacionSchema = new mongoose.Schema(
  {
    donante_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donante",
      required: true,
      index: true
    },

    tipo_donacion: {
      type: String,
      enum: [
        "dinero",
        "alimentos",
        "medicamentos",
        "ropa",
        "albergue",
        "otros"
      ],
      required: true
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    unidad_medida: {
      type: String,
      required: true,
      trim: true,
      default: "unidades"
    },

    ubicacion_entrega: {
      type: String,
      trim: true,
      default: ""
    },

    estado: {
      type: String,
      enum: [
        "disponible",
        "asignada",
        "entregada",
        "cancelada"
      ],
      default: "disponible",
      index: true
    },

    solicitud_apoyo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SolicitudApoyo",
      default: null,
      index: true
    },

    beneficiario_usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    fecha_oferta: {
      type: Date,
      default: Date.now
    },

    fecha_asignacion: {
      type: Date,
      default: null
    },

    fecha_entrega: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

donacionSchema.index({
  donante_id: 1,
  fecha_oferta: -1
});

donacionSchema.index({
  estado: 1,
  tipo_donacion: 1
});

module.exports = mongoose.model(
  "Donacion",
  donacionSchema
);