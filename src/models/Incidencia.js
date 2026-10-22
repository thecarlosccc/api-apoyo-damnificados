const mongoose = require("mongoose");

/*
 * Geolocalización opcional en formato GeoJSON.
 * coordinates = [longitud, latitud]
 */
const geoPointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },

    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length === 2
          );
        },
        message:
          "La geolocalización debe contener [longitud, latitud]"
      }
    }
  },
  {
    _id: false
  }
);

const incidenciaSchema = new mongoose.Schema(
  {
    /*
     * Usuario que reportó la incidencia.
     */
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /*
     * Categoría de la incidencia.
     */
    categoria_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoriaIncidencia",
      required: true,
      index: true
    },

    titulo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500
    },

    /*
     * Dirección, barrio, vereda, sector
     * o descripción textual del lugar.
     */
    ubicacion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },

    /*
     * GPS opcional.
     */
    geolocalizacion: {
      type: geoPointSchema,
      default: undefined
    },

    /*
     * Inicialmente almacenaremos URLs/rutas
     * de imágenes o archivos.
     */
    evidencias: {
      type: [String],
      default: []
    },

    /*
     * La priorización está contemplada
     * en la lógica funcional del proyecto.
     */
    nivel_prioridad: {
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
        "resuelta"
      ],
      default: "pendiente",
      index: true
    },

    fecha_reporte: {
      type: Date,
      default: Date.now
    },

    fecha_actualizacion: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/*
 * Actualizar la fecha cada vez
 * que se modifica una incidencia.
 */
incidenciaSchema.pre("save", function (next) {
  this.fecha_actualizacion = new Date();
  next();
});

/*
 * Permite futuras consultas geográficas.
 */
incidenciaSchema.index(
  {
    geolocalizacion: "2dsphere"
  },
  {
    sparse: true
  }
);

/*
 * Índices útiles para filtros
 * y seguimiento.
 */
incidenciaSchema.index({
  usuario_id: 1,
  fecha_reporte: -1
});

incidenciaSchema.index({
  estado: 1,
  nivel_prioridad: 1
});

module.exports = mongoose.model(
  "Incidencia",
  incidenciaSchema
);