const SolicitudApoyo = require(
  "../models/SolicitudApoyo"
);

const Incidencia = require(
  "../models/Incidencia"
);


/*
 * =========================================================
 * CREAR SOLICITUD DE APOYO
 * =========================================================
 *
 * Solo un usuario con rol damnificado.
 * Puede asociarse opcionalmente a una incidencia propia.
 */
exports.crear = async (req, res) => {
  try {
    const {
      incidencia_id,
      tipo_apoyo,
      descripcion,
      cantidad_requerida,
      unidad_medida,
      prioridad
    } = req.body;

    if (
      !tipo_apoyo ||
      !descripcion
    ) {
      return res.status(400).json({
        message:
          "Tipo de apoyo y descripción son obligatorios"
      });
    }

    /*
     * Si se envía incidencia_id,
     * verificamos que:
     *
     * 1. exista
     * 2. pertenezca al usuario autenticado
     */
    if (incidencia_id) {
      const incidencia =
        await Incidencia.findOne({
          _id: incidencia_id,
          usuario_id: req.user._id
        });

      if (!incidencia) {
        return res.status(400).json({
          message:
            "La incidencia indicada no existe o no pertenece al usuario"
        });
      }
    }

    const solicitud =
      await SolicitudApoyo.create({
        usuario_id: req.user._id,

        incidencia_id:
          incidencia_id || null,

        tipo_apoyo:
          tipo_apoyo.trim(),

        descripcion:
          descripcion.trim(),

        cantidad_requerida:
          cantidad_requerida || 1,

        unidad_medida:
          unidad_medida
            ? unidad_medida.trim()
            : "unidad",

        prioridad:
          prioridad || "media",

        estado: "pendiente"
      });

    const solicitudCompleta =
      await SolicitudApoyo.findById(
        solicitud._id
      )
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "incidencia_id",
          "titulo descripcion ubicacion nivel_prioridad estado"
        );

    return res.status(201).json({
      message:
        "Solicitud de apoyo registrada correctamente",

      solicitud:
        solicitudCompleta
    });
  } catch (error) {
    console.error(
      "Error creando solicitud de apoyo:",
      error
    );

    return res.status(500).json({
      message:
        "Error al registrar la solicitud de apoyo",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * LISTAR TODAS LAS SOLICITUDES
 * =========================================================
 *
 * Uso administrativo.
 *
 * Filtros opcionales:
 *
 * ?estado=pendiente
 * ?prioridad=alta
 * ?tipo_apoyo=alimentos
 */
exports.listar = async (req, res) => {
  try {
    const filtro = {};

    if (req.query.estado) {
      filtro.estado =
        req.query.estado;
    }

    if (req.query.prioridad) {
      filtro.prioridad =
        req.query.prioridad;
    }

    if (req.query.tipo_apoyo) {
      filtro.tipo_apoyo = {
        $regex:
          req.query.tipo_apoyo,
        $options: "i"
      };
    }

    const solicitudes =
      await SolicitudApoyo.find(
        filtro
      )
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "incidencia_id",
          "titulo ubicacion nivel_prioridad estado"
        )
        .sort({
          fecha_solicitud: -1
        });

    return res.status(200).json(
      solicitudes
    );
  } catch (error) {
    console.error(
      "Error listando solicitudes:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar las solicitudes de apoyo",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * LISTAR MIS SOLICITUDES
 * =========================================================
 *
 * El damnificado consulta únicamente
 * sus propias solicitudes.
 */
exports.listarMias = async (
  req,
  res
) => {
  try {
    const solicitudes =
      await SolicitudApoyo.find({
        usuario_id:
          req.user._id
      })
        .populate(
          "incidencia_id",
          "titulo ubicacion nivel_prioridad estado"
        )
        .sort({
          fecha_solicitud: -1
        });

    return res.status(200).json(
      solicitudes
    );
  } catch (error) {
    console.error(
      "Error consultando mis solicitudes:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar las solicitudes del usuario",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * CONSULTAR SOLICITUD POR ID
 * =========================================================
 *
 * Administrador:
 * puede consultar cualquier solicitud.
 *
 * Damnificado:
 * solamente una solicitud propia.
 */
exports.obtenerPorId = async (
  req,
  res
) => {
  try {
    const solicitud =
      await SolicitudApoyo.findById(
        req.params.id
      )
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "incidencia_id",
          "titulo descripcion ubicacion nivel_prioridad estado"
        );

    if (!solicitud) {
      return res.status(404).json({
        message:
          "Solicitud de apoyo no encontrada"
      });
    }

    const usuarioSolicitud =
      solicitud.usuario_id
        ._id
        .toString();

    const usuarioActual =
      req.user._id
        .toString();

    if (
      req.user.rol !==
        "administrador" &&
      usuarioSolicitud !==
        usuarioActual
    ) {
      return res.status(403).json({
        message:
          "No está autorizado para consultar esta solicitud"
      });
    }

    return res.status(200).json(
      solicitud
    );
  } catch (error) {
    console.error(
      "Error consultando solicitud:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar la solicitud de apoyo",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * ACTUALIZAR MI SOLICITUD
 * =========================================================
 *
 * El damnificado puede modificar
 * una solicitud propia mientras
 * permanezca pendiente.
 */
exports.actualizarMia = async (
  req,
  res
) => {
  try {
    const solicitud =
      await SolicitudApoyo.findOne({
        _id: req.params.id,
        usuario_id:
          req.user._id
      });

    if (!solicitud) {
      return res.status(404).json({
        message:
          "Solicitud de apoyo no encontrada"
      });
    }

    if (
      solicitud.estado !==
        "pendiente"
    ) {
      return res.status(400).json({
        message:
          "Solo pueden modificarse solicitudes pendientes"
      });
    }

    const {
      incidencia_id,
      tipo_apoyo,
      descripcion,
      cantidad_requerida,
      unidad_medida,
      prioridad
    } = req.body;

    /*
     * Si cambia la incidencia,
     * debe existir y ser propia.
     */
    if (
      incidencia_id !==
        undefined
    ) {
      if (
        incidencia_id === null ||
        incidencia_id === ""
      ) {
        solicitud.incidencia_id =
          null;
      } else {
        const incidencia =
          await Incidencia.findOne({
            _id:
              incidencia_id,
            usuario_id:
              req.user._id
          });

        if (!incidencia) {
          return res.status(400).json({
            message:
              "La incidencia indicada no existe o no pertenece al usuario"
          });
        }

        solicitud.incidencia_id =
          incidencia_id;
      }
    }

    if (
      tipo_apoyo !==
        undefined
    ) {
      solicitud.tipo_apoyo =
        tipo_apoyo.trim();
    }

    if (
      descripcion !==
        undefined
    ) {
      solicitud.descripcion =
        descripcion.trim();
    }

    if (
      cantidad_requerida !==
        undefined
    ) {
      if (
        Number(
          cantidad_requerida
        ) < 1
      ) {
        return res.status(400).json({
          message:
            "La cantidad requerida debe ser mayor o igual a 1"
        });
      }

      solicitud.cantidad_requerida =
        Number(
          cantidad_requerida
        );
    }

    if (
      unidad_medida !==
        undefined
    ) {
      solicitud.unidad_medida =
        unidad_medida.trim();
    }

    if (
      prioridad !==
        undefined
    ) {
      const prioridadesPermitidas = [
        "baja",
        "media",
        "alta",
        "critica"
      ];

      if (
        !prioridadesPermitidas.includes(
          prioridad
        )
      ) {
        return res.status(400).json({
          message:
            "Prioridad no válida"
        });
      }

      solicitud.prioridad =
        prioridad;
    }

    await solicitud.save();

    const solicitudActualizada =
      await SolicitudApoyo.findById(
        solicitud._id
      )
        .populate(
          "incidencia_id",
          "titulo ubicacion nivel_prioridad estado"
        );

    return res.status(200).json({
      message:
        "Solicitud de apoyo actualizada correctamente",

      solicitud:
        solicitudActualizada
    });
  } catch (error) {
    console.error(
      "Error actualizando solicitud:",
      error
    );

    return res.status(500).json({
      message:
        "Error al actualizar la solicitud de apoyo",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * CANCELAR MI SOLICITUD
 * =========================================================
 *
 * El damnificado puede cancelar
 * su propia solicitud mientras
 * no haya sido atendida.
 */
exports.cancelarMia = async (
  req,
  res
) => {
  try {
    const solicitud =
      await SolicitudApoyo.findOne({
        _id: req.params.id,
        usuario_id:
          req.user._id
      });

    if (!solicitud) {
      return res.status(404).json({
        message:
          "Solicitud de apoyo no encontrada"
      });
    }

    if (
      solicitud.estado ===
        "atendida"
    ) {
      return res.status(400).json({
        message:
          "Una solicitud atendida no puede cancelarse"
      });
    }

    solicitud.estado =
      "cancelada";

    await solicitud.save();

    return res.status(200).json({
      message:
        "Solicitud de apoyo cancelada correctamente",

      solicitud
    });
  } catch (error) {
    console.error(
      "Error cancelando solicitud:",
      error
    );

    return res.status(500).json({
      message:
        "Error al cancelar la solicitud de apoyo",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * CAMBIAR ESTADO
 * =========================================================
 *
 * Solo administrador.
 *
 * Estados:
 *
 * pendiente
 * en_proceso
 * atendida
 * cancelada
 */
exports.cambiarEstado = async (
  req,
  res
) => {
  try {
    const {
      estado,
      observacion_admin
    } = req.body;

    const estadosPermitidos = [
      "pendiente",
      "en_proceso",
      "atendida",
      "cancelada"
    ];

    if (
      !estado ||
      !estadosPermitidos.includes(
        estado
      )
    ) {
      return res.status(400).json({
        message:
          "Estado no válido"
      });
    }

    const solicitud =
      await SolicitudApoyo.findById(
        req.params.id
      );

    if (!solicitud) {
      return res.status(404).json({
        message:
          "Solicitud de apoyo no encontrada"
      });
    }

    solicitud.estado =
      estado;

    if (
      observacion_admin !==
        undefined
    ) {
      solicitud.observacion_admin =
        observacion_admin.trim();
    }

    /*
     * Cuando la solicitud se atiende,
     * registramos la fecha.
     */
    if (
      estado === "atendida"
    ) {
      solicitud.fecha_atencion =
        new Date();
    } else {
      solicitud.fecha_atencion =
        null;
    }

    await solicitud.save();

    const solicitudActualizada =
      await SolicitudApoyo.findById(
        solicitud._id
      )
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "incidencia_id",
          "titulo ubicacion nivel_prioridad estado"
        );

    return res.status(200).json({
      message:
        "Estado de la solicitud actualizado correctamente",

      solicitud:
        solicitudActualizada
    });
  } catch (error) {
    console.error(
      "Error cambiando estado de solicitud:",
      error
    );

    return res.status(500).json({
      message:
        "Error al cambiar el estado de la solicitud de apoyo",
      error: error.message
    });
  }
};