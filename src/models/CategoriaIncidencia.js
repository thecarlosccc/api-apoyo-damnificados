const mongoose = require("mongoose");

const categoriaIncidenciaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    descripcion: {
      type: String,
      required: true,
      trim: true
    },

    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CategoriaIncidencia",
  categoriaIncidenciaSchema
);