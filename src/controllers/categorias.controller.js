const CategoriaIncidencia = require("../models/CategoriaIncidencia");

// Listar todas las categorías
const listar = async (req, res) => {
  try {
    const categorias = await CategoriaIncidencia.find().sort({
      nombre: 1
    });

    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({
      message: "Error al consultar las categorías",
      error: error.message
    });
  }
};

// Obtener una categoría por ID
const obtenerPorId = async (req, res) => {
  try {
    const categoria = await CategoriaIncidencia.findById(
      req.params.id
    );

    if (!categoria) {
      return res.status(404).json({
        message: "Categoría no encontrada"
      });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json({
      message: "Error al consultar la categoría",
      error: error.message
    });
  }
};

// Crear una categoría
const crear = async (req, res) => {
  try {
    const {
      nombre,
      descripcion
    } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({
        message: "Nombre y descripción son obligatorios"
      });
    }

    const existente = await CategoriaIncidencia.findOne({
      nombre: nombre.trim()
    });

    if (existente) {
      return res.status(409).json({
        message: "Ya existe una categoría con ese nombre"
      });
    }

    const categoria = await CategoriaIncidencia.create({
      nombre: nombre.trim(),
      descripcion: descripcion.trim()
    });

    return res.status(201).json({
      message: "Categoría creada correctamente",
      categoria
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la categoría",
      error: error.message
    });
  }
};

// Actualizar una categoría
const actualizar = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      estado
    } = req.body;

    const categoria = await CategoriaIncidencia.findById(
      req.params.id
    );

    if (!categoria) {
      return res.status(404).json({
        message: "Categoría no encontrada"
      });
    }

    if (nombre) {
      const existente = await CategoriaIncidencia.findOne({
        nombre: nombre.trim(),
        _id: { $ne: req.params.id }
      });

      if (existente) {
        return res.status(409).json({
          message: "Ya existe otra categoría con ese nombre"
        });
      }

      categoria.nombre = nombre.trim();
    }

    if (descripcion) {
      categoria.descripcion = descripcion.trim();
    }

    if (estado) {
      if (!["activo", "inactivo"].includes(estado)) {
        return res.status(400).json({
          message: "El estado debe ser activo o inactivo"
        });
      }

      categoria.estado = estado;
    }

    await categoria.save();

    return res.status(200).json({
      message: "Categoría actualizada correctamente",
      categoria
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la categoría",
      error: error.message
    });
  }
};

// Eliminación lógica de una categoría
const eliminar = async (req, res) => {
  try {
    const categoria = await CategoriaIncidencia.findById(
      req.params.id
    );

    if (!categoria) {
      return res.status(404).json({
        message: "Categoría no encontrada"
      });
    }

    categoria.estado = "inactivo";
    await categoria.save();

    return res.status(200).json({
      message: "Categoría desactivada correctamente",
      categoria
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al desactivar la categoría",
      error: error.message
    });
  }
};

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};