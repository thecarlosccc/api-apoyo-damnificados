const mongoose = require("mongoose");

const solicitudApoyoSchema =
  new mongoose.Schema(
    {
      /*
       * Usuario damnificado que realiza
       * la solicitud.
       */
      usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },

      /*
       * Incidencia relacionada.
       * Es opcional.
       */
      incidencia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incidencia",
        default: null
      },

      tipo_apoyo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      },

      descripcion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1500
      },

      cantidad_requerida: {
        type: Number,
        default: 1,
        min: 1
      },

      unidad_medida: {
        type: String,
        trim: true,
        default: "unidad"
      },

      prioridad: {
        type: String,
        enum: [
          "baja",
          "media",
          "alta",
          "critica"
        ],
        default: "media"
      },

      estado: {
        type: String,
        enum: [
          "pendiente",
          "en_proceso",
          "atendida",
          "cancelada"
        ],
        default: "pendiente",
        index: true
      },

      observacion_admin: {
        type: String,
        trim: true,
        default: ""
      },

      fecha_solicitud: {
        type: Date,
        default: Date.now
      },

      fecha_atencion: {
        type: Date,
        default: null
      }
    },
    {
      timestamps: true
    }
  );

solicitudApoyoSchema.index({
  usuario_id: 1,
  fecha_solicitud: -1
});

solicitudApoyoSchema.index({
  estado: 1,
  prioridad: 1
});

module.exports = mongoose.model(
  "SolicitudApoyo",
  solicitudApoyoSchema
);