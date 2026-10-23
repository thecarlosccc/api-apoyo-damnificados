const mongoose = require("mongoose");

const notificacionSchema = new mongoose.Schema(
  {
    usuario_destino_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    titulo: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "Notificación"
    },

    mensaje: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    /*
     * Se conservan los tipos antiguos para
     * mantener compatibilidad con datos legacy.
     */
    tipo: {
      type: String,
      enum: [
        "solicitud_atendida",
        "necesidades_cercanas",
        "alerta_general",
        "incidencia_estado",
        "solicitud_estado",
        "donacion_asignada",
        "donacion_entregada",
        "perfil_damnificado"
      ],
      default: "alerta_general",
      index: true
    },

    /*
     * Permite saber desde qué módulo
     * se originó la notificación.
     */
    referencia: {
      modulo: {
        type: String,
        enum: [
          "incidencia",
          "solicitud_apoyo",
          "donacion",
          "damnificado",
          "general"
        ],
        default: "general"
      },

      recurso_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    },

    leido: {
      type: Boolean,
      default: false,
      index: true
    },

    fecha_lectura: {
      type: Date,
      default: null
    },

    fecha_envio: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);


/*
 * Consulta habitual:
 * notificaciones del usuario,
 * ordenadas desde las más recientes.
 */
notificacionSchema.index({
  usuario_destino_id: 1,
  fecha_envio: -1
});


module.exports = mongoose.model(
  "Notificacion",
  notificacionSchema
);