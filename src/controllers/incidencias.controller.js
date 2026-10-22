const Incidencia = require("../models/Incidencia");
const CategoriaIncidencia = require(
  "../models/CategoriaIncidencia"
);

/*
 * =========================================================
 * CREAR INCIDENCIA
 * =========================================================
 * El usuario damnificado crea una incidencia.
 * El usuario_id se obtiene del JWT y nunca del body.
 */
exports.crear = async (req, res) => {
  try {
    const {
      categoria_id,
      titulo,
      descripcion,
      ubicacion,
      geolocalizacion,
      evidencias,
      nivel_prioridad
    } = req.body;

    if (
      !categoria_id ||
      !titulo ||
      !descripcion ||
      !ubicacion
    ) {
      return res.status(400).json({
        message:
          "Categoría, título, descripción y ubicación son obligatorios"
      });
    }

    /*
     * Validamos que la categoría exista
     * y esté activa.
     */
    const categoria =
      await CategoriaIncidencia.findOne({
        _id: categoria_id,
        estado: "activo"
      });

    if (!categoria) {
      return res.status(400).json({
        message:
          "La categoría seleccionada no existe o está inactiva"
      });
    }

    const incidencia = await Incidencia.create({
      usuario_id: req.user._id,
      categoria_id,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
      geolocalizacion:
        geolocalizacion || undefined,
      evidencias:
        Array.isArray(evidencias)
          ? evidencias
          : [],
      nivel_prioridad:
        nivel_prioridad || "media",
      estado: "pendiente"
    });

    const incidenciaCompleta =
      await Incidencia.findById(
        incidencia._id
      )
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "categoria_id",
          "nombre descripcion estado"
        );

    return res.status(201).json({
      message:
        "Incidencia registrada correctamente",
      incidencia: incidenciaCompleta
    });
  } catch (error) {
    console.error(
      "Error creando incidencia:",
      error
    );

    return res.status(500).json({
      message:
        "Error al registrar la incidencia",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * LISTAR TODAS LAS INCIDENCIAS
 * =========================================================
 * Uso administrativo.
 *
 * Permite filtros opcionales:
 * ?estado=pendiente
 * ?prioridad=alta
 * ?categoria_id=...
 */
exports.listar = async (req, res) => {
  try {
    const filtro = {};

    if (req.query.estado) {
      filtro.estado = req.query.estado;
    }

    if (req.query.prioridad) {
      filtro.nivel_prioridad =
        req.query.prioridad;
    }

    if (req.query.categoria_id) {
      filtro.categoria_id =
        req.query.categoria_id;
    }

    const incidencias =
      await Incidencia.find(filtro)
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "categoria_id",
          "nombre descripcion estado"
        )
        .sort({
          fecha_reporte: -1
        });

    return res.status(200).json(
      incidencias
    );
  } catch (error) {
    console.error(
      "Error listando incidencias:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar las incidencias",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * LISTAR MIS INCIDENCIAS
 * =========================================================
 * El damnificado consulta únicamente
 * las incidencias que él mismo reportó.
 */
exports.listarMias = async (req, res) => {
  try {
    const incidencias =
      await Incidencia.find({
        usuario_id: req.user._id
      })
        .populate(
          "categoria_id",
          "nombre descripcion estado"
        )
        .sort({
          fecha_reporte: -1
        });

    return res.status(200).json(
      incidencias
    );
  } catch (error) {
    console.error(
      "Error consultando mis incidencias:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar las incidencias del usuario",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * CONSULTAR INCIDENCIA POR ID
 * =========================================================
 *
 * Administrador:
 * puede consultar cualquier incidencia.
 *
 * Damnificado:
 * solamente puede consultar las propias.
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const incidencia =
      await Incidencia.findById(
        req.params.id
      )
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "categoria_id",
          "nombre descripcion estado"
        );

    if (!incidencia) {
      return res.status(404).json({
        message:
          "Incidencia no encontrada"
      });
    }

    if (
      req.user.rol !== "administrador" &&
      incidencia.usuario_id._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "No está autorizado para consultar esta incidencia"
      });
    }

    return res.status(200).json(
      incidencia
    );
  } catch (error) {
    console.error(
      "Error consultando incidencia:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar la incidencia",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * ACTUALIZAR MI INCIDENCIA
 * =========================================================
 *
 * El damnificado puede modificar información
 * descriptiva de una incidencia propia.
 *
 * No puede cambiar el estado.
 */
exports.actualizarMia = async (
  req,
  res
) => {
  try {
    const incidencia =
      await Incidencia.findOne({
        _id: req.params.id,
        usuario_id: req.user._id
      });

    if (!incidencia) {
      return res.status(404).json({
        message:
          "Incidencia no encontrada"
      });
    }

    /*
     * Una incidencia resuelta conserva
     * su información como evidencia histórica.
     */
    if (
      incidencia.estado === "resuelta"
    ) {
      return res.status(400).json({
        message:
          "Una incidencia resuelta no puede ser modificada"
      });
    }

    const {
      categoria_id,
      titulo,
      descripcion,
      ubicacion,
      geolocalizacion,
      evidencias,
      nivel_prioridad
    } = req.body;

    /*
     * Si cambia la categoría,
     * debe existir y estar activa.
     */
    if (
      categoria_id &&
      categoria_id !==
        incidencia.categoria_id.toString()
    ) {
      const categoria =
        await CategoriaIncidencia.findOne({
          _id: categoria_id,
          estado: "activo"
        });

      if (!categoria) {
        return res.status(400).json({
          message:
            "La categoría seleccionada no existe o está inactiva"
        });
      }

      incidencia.categoria_id =
        categoria_id;
    }

    if (titulo !== undefined) {
      incidencia.titulo =
        titulo.trim();
    }

    if (descripcion !== undefined) {
      incidencia.descripcion =
        descripcion.trim();
    }

    if (ubicacion !== undefined) {
      incidencia.ubicacion =
        ubicacion.trim();
    }

    if (
      geolocalizacion !== undefined
    ) {
      incidencia.geolocalizacion =
        geolocalizacion;
    }

    if (Array.isArray(evidencias)) {
      incidencia.evidencias =
        evidencias;
    }

    if (
      nivel_prioridad !== undefined
    ) {
      const prioridadesPermitidas = [
        "baja",
        "media",
        "alta",
        "critica"
      ];

      if (
        !prioridadesPermitidas.includes(
          nivel_prioridad
        )
      ) {
        return res.status(400).json({
          message:
            "Nivel de prioridad no válido"
        });
      }

      incidencia.nivel_prioridad =
        nivel_prioridad;
    }

    await incidencia.save();

    const incidenciaActualizada =
      await Incidencia.findById(
        incidencia._id
      )
        .populate(
          "categoria_id",
          "nombre descripcion estado"
        );

    return res.status(200).json({
      message:
        "Incidencia actualizada correctamente",
      incidencia:
        incidenciaActualizada
    });
  } catch (error) {
    console.error(
      "Error actualizando incidencia:",
      error
    );

    return res.status(500).json({
      message:
        "Error al actualizar la incidencia",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * CAMBIAR ESTADO DE INCIDENCIA
 * =========================================================
 *
 * Solo administrador.
 *
 * Flujo:
 * pendiente
 * en_proceso
 * resuelta
 */
exports.cambiarEstado = async (
  req,
  res
) => {
  try {
    const {
      estado
    } = req.body;

    const estadosPermitidos = [
      "pendiente",
      "en_proceso",
      "resuelta"
    ];

    if (
      !estado ||
      !estadosPermitidos.includes(
        estado
      )
    ) {
      return res.status(400).json({
        message:
          "Estado no válido. Use pendiente, en_proceso o resuelta"
      });
    }

    const incidencia =
      await Incidencia.findById(
        req.params.id
      );

    if (!incidencia) {
      return res.status(404).json({
        message:
          "Incidencia no encontrada"
      });
    }

    incidencia.estado = estado;

    await incidencia.save();

    const incidenciaActualizada =
      await Incidencia.findById(
        incidencia._id
      )
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "categoria_id",
          "nombre descripcion estado"
        );

    return res.status(200).json({
      message:
        "Estado de la incidencia actualizado correctamente",
      incidencia:
        incidenciaActualizada
    });
  } catch (error) {
    console.error(
      "Error cambiando estado:",
      error
    );

    return res.status(500).json({
      message:
        "Error al cambiar el estado de la incidencia",
      error: error.message
    });
  }
};