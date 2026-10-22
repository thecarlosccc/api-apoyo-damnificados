const Donacion = require(
  "../models/Donacion"
);

const Donante = require(
  "../models/Donante"
);

const SolicitudApoyo = require(
  "../models/SolicitudApoyo"
);


/*
 * =========================================================
 * FUNCIÓN AUXILIAR
 * =========================================================
 * Devuelve una donación con todas las relaciones
 * principales pobladas para responder al frontend.
 */
async function obtenerDonacionCompleta(id) {
  return Donacion.findById(id)
    .populate({
      path: "donante_id",
      populate: {
        path: "usuario_id",
        select:
          "nombre_completo correo telefono rol"
      }
    })
    .populate(
      "beneficiario_usuario_id",
      "nombre_completo correo telefono rol"
    )
    .populate({
      path: "solicitud_apoyo_id",
      populate: [
        {
          path: "usuario_id",
          select:
            "nombre_completo correo telefono rol"
        },
        {
          path: "incidencia_id",
          select:
            "titulo ubicacion nivel_prioridad estado"
        }
      ]
    });
}


/*
 * =========================================================
 * CATÁLOGO DE DONACIONES DISPONIBLES
 * =========================================================
 *
 * Permite consultar ayudas disponibles.
 */
exports.listarCatalogo = async (
  req,
  res
) => {
  try {
    const items =
      await Donacion.find({
        estado: "disponible"
      })
        .populate({
          path: "donante_id",
          populate: {
            path: "usuario_id",
            select:
              "nombre_completo"
          }
        })
        .sort({
          fecha_oferta: -1
        });

    return res.status(200).json(
      items
    );
  } catch (error) {
    console.error(
      "Error consultando catálogo:",
      error
    );

    return res.status(500).json({
      message:
        "Error consultando catálogo de donaciones",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * LISTAR TODAS LAS DONACIONES
 * =========================================================
 *
 * Uso administrativo.
 *
 * Filtros opcionales:
 *
 * ?estado=disponible
 * ?tipo=alimentos
 */
exports.listar = async (
  req,
  res
) => {
  try {
    const filtro = {};

    if (req.query.estado) {
      filtro.estado =
        req.query.estado;
    }

    if (req.query.tipo) {
      filtro.tipo_donacion =
        req.query.tipo;
    }

    const items =
      await Donacion.find(
        filtro
      )
        .populate({
          path: "donante_id",
          populate: {
            path: "usuario_id",
            select:
              "nombre_completo correo telefono rol"
          }
        })
        .populate(
          "beneficiario_usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate({
          path: "solicitud_apoyo_id",
          populate: {
            path: "incidencia_id",
            select:
              "titulo ubicacion estado"
          }
        })
        .sort({
          fecha_oferta: -1
        });

    return res.status(200).json(
      items
    );
  } catch (error) {
    console.error(
      "Error listando donaciones:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar las donaciones",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * LISTAR MIS DONACIONES
 * =========================================================
 *
 * El donante consulta únicamente
 * las donaciones que él ha registrado.
 */
exports.listarMias = async (
  req,
  res
) => {
  try {
    const donante =
      await Donante.findOne({
        usuario_id:
          req.user._id
      });

    if (!donante) {
      return res.status(404).json({
        message:
          "Perfil de donante no encontrado"
      });
    }

    const items =
      await Donacion.find({
        donante_id:
          donante._id
      })
        .populate(
          "beneficiario_usuario_id",
          "nombre_completo correo telefono"
        )
        .populate({
          path: "solicitud_apoyo_id",
          populate: {
            path: "incidencia_id",
            select:
              "titulo ubicacion estado"
          }
        })
        .sort({
          fecha_oferta: -1
        });

    return res.status(200).json(
      items
    );
  } catch (error) {
    console.error(
      "Error consultando mis donaciones:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar las donaciones del usuario",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * CREAR DONACIÓN
 * =========================================================
 *
 * Solo usuarios con rol donante.
 */
exports.crear = async (
  req,
  res
) => {
  try {
    const {
      tipo_donacion,
      descripcion,
      cantidad,
      unidad_medida,
      ubicacion_entrega
    } = req.body;

    if (
      !tipo_donacion ||
      !descripcion
    ) {
      return res.status(400).json({
        message:
          "Tipo de donación y descripción son obligatorios"
      });
    }

    const tiposPermitidos = [
      "dinero",
      "alimentos",
      "medicamentos",
      "ropa",
      "albergue",
      "otros"
    ];

    if (
      !tiposPermitidos.includes(
        tipo_donacion
      )
    ) {
      return res.status(400).json({
        message:
          "Tipo de donación no válido"
      });
    }

    const donante =
      await Donante.findOne({
        usuario_id:
          req.user._id
      });

    if (!donante) {
      return res.status(400).json({
        message:
          "Perfil de donante no encontrado"
      });
    }

    const cantidadFinal =
      cantidad !== undefined
        ? Number(cantidad)
        : 1;

    if (
      Number.isNaN(
        cantidadFinal
      ) ||
      cantidadFinal < 1
    ) {
      return res.status(400).json({
        message:
          "La cantidad debe ser mayor o igual a 1"
      });
    }

    const item =
      await Donacion.create({
        donante_id:
          donante._id,

        tipo_donacion,

        descripcion:
          descripcion.trim(),

        cantidad:
          cantidadFinal,

        unidad_medida:
          unidad_medida
            ? unidad_medida.trim()
            : "unidades",

        ubicacion_entrega:
          ubicacion_entrega
            ? ubicacion_entrega.trim()
            : "",

        estado:
          "disponible"
      });

    const donacionCompleta =
      await obtenerDonacionCompleta(
        item._id
      );

    return res.status(201).json({
      message:
        "Donación registrada correctamente",

      donacion:
        donacionCompleta
    });
  } catch (error) {
    console.error(
      "Error creando donación:",
      error
    );

    return res.status(500).json({
      message:
        "Error al registrar la donación",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * CANCELAR MI DONACIÓN
 * =========================================================
 *
 * El donante puede cancelar una ayuda
 * solamente mientras esté disponible.
 */
exports.cancelarMia = async (
  req,
  res
) => {
  try {
    const donante =
      await Donante.findOne({
        usuario_id:
          req.user._id
      });

    if (!donante) {
      return res.status(404).json({
        message:
          "Perfil de donante no encontrado"
      });
    }

    const donacion =
      await Donacion.findOne({
        _id:
          req.params.id,

        donante_id:
          donante._id
      });

    if (!donacion) {
      return res.status(404).json({
        message:
          "Donación no encontrada"
      });
    }

    if (
      donacion.estado !==
        "disponible"
    ) {
      return res.status(400).json({
        message:
          "Solo pueden cancelarse donaciones disponibles"
      });
    }

    donacion.estado =
      "cancelada";

    await donacion.save();

    return res.status(200).json({
      message:
        "Donación cancelada correctamente",

      donacion
    });
  } catch (error) {
    console.error(
      "Error cancelando donación:",
      error
    );

    return res.status(500).json({
      message:
        "Error al cancelar la donación",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * ASIGNAR DONACIÓN
 * =========================================================
 *
 * Solo administrador.
 *
 * La donación se asigna directamente
 * a una Solicitud de Apoyo.
 *
 * Al asignarla:
 *
 * donación:
 * disponible -> asignada
 *
 * solicitud:
 * pendiente -> en_proceso
 */
exports.asignar = async (
  req,
  res
) => {
  try {
    const {
      solicitud_apoyo_id
    } = req.body;

    if (!solicitud_apoyo_id) {
      return res.status(400).json({
        message:
          "La solicitud de apoyo es obligatoria"
      });
    }

    const donacion =
      await Donacion.findById(
        req.params.id
      );

    if (!donacion) {
      return res.status(404).json({
        message:
          "Donación no encontrada"
      });
    }

    if (
      donacion.estado !==
        "disponible"
    ) {
      return res.status(400).json({
        message:
          "La donación no se encuentra disponible"
      });
    }

    const solicitud =
      await SolicitudApoyo.findById(
        solicitud_apoyo_id
      );

    if (!solicitud) {
      return res.status(404).json({
        message:
          "Solicitud de apoyo no encontrada"
      });
    }

    if (
      solicitud.estado ===
        "atendida" ||
      solicitud.estado ===
        "cancelada"
    ) {
      return res.status(400).json({
        message:
          "La solicitud seleccionada no puede recibir nuevas asignaciones"
      });
    }

    /*
     * Actualizar donación.
     */
    donacion.estado =
      "asignada";

    donacion.solicitud_apoyo_id =
      solicitud._id;

    donacion.beneficiario_usuario_id =
      solicitud.usuario_id;

    donacion.fecha_asignacion =
      new Date();

    await donacion.save();

    /*
     * Actualizar automáticamente
     * la solicitud.
     */
    solicitud.estado =
      "en_proceso";

    solicitud.observacion_admin =
      "Se asignó una donación para atender esta solicitud.";

    await solicitud.save();

    const donacionCompleta =
      await obtenerDonacionCompleta(
        donacion._id
      );

    return res.status(200).json({
      message:
        "Donación asignada correctamente",

      donacion:
        donacionCompleta
    });
  } catch (error) {
    console.error(
      "Error asignando donación:",
      error
    );

    return res.status(500).json({
      message:
        "Error al asignar la donación",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * MARCAR DONACIÓN COMO ENTREGADA
 * =========================================================
 *
 * Solo administrador.
 *
 * Al confirmar la entrega:
 *
 * donación:
 * asignada -> entregada
 *
 * solicitud:
 * en_proceso -> atendida
 */
exports.marcarEntregada = async (
  req,
  res
) => {
  try {
    const donacion =
      await Donacion.findById(
        req.params.id
      );

    if (!donacion) {
      return res.status(404).json({
        message:
          "Donación no encontrada"
      });
    }

    if (
      donacion.estado !==
        "asignada"
    ) {
      return res.status(400).json({
        message:
          "Solo puede entregarse una donación previamente asignada"
      });
    }

    donacion.estado =
      "entregada";

    donacion.fecha_entrega =
      new Date();

    await donacion.save();

    /*
     * Si existe solicitud asociada,
     * también se marca como atendida.
     */
    if (
      donacion.solicitud_apoyo_id
    ) {
      const solicitud =
        await SolicitudApoyo.findById(
          donacion.solicitud_apoyo_id
        );

      if (solicitud) {
        solicitud.estado =
          "atendida";

        solicitud.fecha_atencion =
          new Date();

        solicitud.observacion_admin =
          "La ayuda asignada fue entregada correctamente.";

        await solicitud.save();
      }
    }

    const donacionCompleta =
      await obtenerDonacionCompleta(
        donacion._id
      );

    return res.status(200).json({
      message:
        "Donación entregada correctamente",

      donacion:
        donacionCompleta
    });
  } catch (error) {
    console.error(
      "Error entregando donación:",
      error
    );

    return res.status(500).json({
      message:
        "Error al marcar la donación como entregada",
      error: error.message
    });
  }
};