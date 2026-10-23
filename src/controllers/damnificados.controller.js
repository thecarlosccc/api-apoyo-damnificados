const Damnificado = require(
  "../models/Damnificado"
);

const {
  crearNotificacion
} = require(
  "./notificaciones.controller"
);


/*
 * =========================================================
 * FUNCIÓN AUXILIAR
 * =========================================================
 * Construye una respuesta completa del perfil.
 */
async function obtenerPerfilCompleto(id) {
  return Damnificado.findById(id)
    .populate(
      "usuario_id",
      "nombre_completo correo telefono rol"
    )
    .populate(
      "registrado_por",
      "nombre_completo correo rol"
    );
}


/*
 * =========================================================
 * LISTAR DAMNIFICADOS
 * =========================================================
 *
 * Uso administrativo.
 */
exports.list = async (
  req,
  res
) => {
  try {
    const items =
      await Damnificado.find()
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "registrado_por",
          "nombre_completo correo rol"
        )
        .sort({
          fecha_registro: -1
        });

    return res.status(200).json(
      items
    );

  } catch (error) {
    console.error(
      "Error listando damnificados:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar los damnificados",

      error:
        error.message
    });
  }
};


/*
 * =========================================================
 * CONSULTAR MI PERFIL
 * =========================================================
 */
exports.my = async (
  req,
  res
) => {
  try {
    const item =
      await Damnificado.findOne({
        usuario_id:
          req.user._id
      })
        .populate(
          "usuario_id",
          "nombre_completo correo telefono rol"
        )
        .populate(
          "registrado_por",
          "nombre_completo correo rol"
        );

    if (!item) {
      return res.status(404).json({
        message:
          "El perfil de damnificado aún no ha sido creado"
      });
    }

    return res.status(200).json(
      item
    );

  } catch (error) {
    console.error(
      "Error consultando perfil de damnificado:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar el perfil de damnificado",

      error:
        error.message
    });
  }
};


/*
 * =========================================================
 * CREAR O ACTUALIZAR MI PERFIL
 * =========================================================
 *
 * Si no existe:
 * - crea el perfil.
 *
 * Si existe:
 * - actualiza únicamente campos permitidos.
 */
exports.updateMy = async (
  req,
  res
) => {
  try {
    const {
      ubicacion,
      datos_familiares,
      afectaciones,
      necesidades_urgentes,
      evidencias
    } = req.body;


    let item =
      await Damnificado.findOne({
        usuario_id:
          req.user._id
      });


    /*
     * =====================================================
     * CREACIÓN
     * =====================================================
     */
    if (!item) {
      if (
        !ubicacion ||
        !ubicacion.departamento ||
        !ubicacion.municipio
      ) {
        return res.status(400).json({
          message:
            "Departamento y municipio son obligatorios para crear el perfil de damnificado"
        });
      }


      item =
        await Damnificado.create({
          usuario_id:
            req.user._id,

          registrado_por:
            req.user._id,

          ubicacion: {
            departamento:
              ubicacion.departamento,

            municipio:
              ubicacion.municipio,

            vereda_sector:
              ubicacion.vereda_sector ||
              "",

            direccion:
              ubicacion.direccion ||
              "",

            geolocalizacion:
              ubicacion.geolocalizacion ||
              {
                type:
                  "Point",

                coordinates:
                  [0, 0]
              }
          },

          datos_familiares:
            datos_familiares ||
            {
              cantidad_personas:
                1,

              descripcion_personas:
                ""
            },

          afectaciones:
            afectaciones ||
            {},

          necesidades_urgentes:
            Array.isArray(
              necesidades_urgentes
            )
              ? necesidades_urgentes
              : [],

          evidencias:
            Array.isArray(
              evidencias
            )
              ? evidencias
              : [],

          estado_solicitud:
            "pendiente"
        });


      const perfil =
        await obtenerPerfilCompleto(
          item._id
        );


      return res.status(201).json({
        message:
          "Perfil de damnificado creado correctamente",

        perfil
      });
    }


    /*
     * =====================================================
     * ACTUALIZACIÓN
     * =====================================================
     */

    if (ubicacion) {
      if (
        ubicacion.departamento !==
        undefined
      ) {
        item.ubicacion.departamento =
          ubicacion.departamento;
      }


      if (
        ubicacion.municipio !==
        undefined
      ) {
        item.ubicacion.municipio =
          ubicacion.municipio;
      }


      if (
        ubicacion.vereda_sector !==
        undefined
      ) {
        item.ubicacion.vereda_sector =
          ubicacion.vereda_sector;
      }


      if (
        ubicacion.direccion !==
        undefined
      ) {
        item.ubicacion.direccion =
          ubicacion.direccion;
      }


      if (
        ubicacion.geolocalizacion !==
        undefined
      ) {
        item.ubicacion.geolocalizacion =
          ubicacion.geolocalizacion;
      }
    }


    if (datos_familiares) {
      if (
        datos_familiares
          .cantidad_personas !==
        undefined
      ) {
        item.datos_familiares
          .cantidad_personas =
          datos_familiares
            .cantidad_personas;
      }


      if (
        datos_familiares
          .descripcion_personas !==
        undefined
      ) {
        item.datos_familiares
          .descripcion_personas =
          datos_familiares
            .descripcion_personas;
      }
    }


    if (afectaciones) {
      if (
        afectaciones.vivienda !==
        undefined
      ) {
        item.afectaciones.vivienda =
          afectaciones.vivienda;
      }


      if (
        afectaciones
          .bienes_materiales !==
        undefined
      ) {
        item.afectaciones
          .bienes_materiales =
          afectaciones
            .bienes_materiales;
      }


      if (
        afectaciones
          .perdida_agricola_ganadera !==
        undefined
      ) {
        item.afectaciones
          .perdida_agricola_ganadera =
          afectaciones
            .perdida_agricola_ganadera;
      }


      if (
        afectaciones
          .detalle_perdidas !==
        undefined
      ) {
        item.afectaciones
          .detalle_perdidas =
          afectaciones
            .detalle_perdidas;
      }


      if (
        afectaciones
          .mascotas_afectadas !==
        undefined
      ) {
        item.afectaciones
          .mascotas_afectadas =
          afectaciones
            .mascotas_afectadas;
      }


      if (
        afectaciones
          .cantidad_mascotas !==
        undefined
      ) {
        item.afectaciones
          .cantidad_mascotas =
          afectaciones
            .cantidad_mascotas;
      }
    }


    if (
      necesidades_urgentes !==
      undefined
    ) {
      if (
        !Array.isArray(
          necesidades_urgentes
        )
      ) {
        return res.status(400).json({
          message:
            "necesidades_urgentes debe ser un arreglo"
        });
      }

      item.necesidades_urgentes =
        necesidades_urgentes;
    }


    if (
      evidencias !==
      undefined
    ) {
      if (
        !Array.isArray(
          evidencias
        )
      ) {
        return res.status(400).json({
          message:
            "evidencias debe ser un arreglo"
        });
      }

      item.evidencias =
        evidencias;
    }


    /*
     * Departamento y municipio
     * nunca pueden quedar vacíos.
     */
    if (
      !item.ubicacion.departamento ||
      !item.ubicacion.municipio
    ) {
      return res.status(400).json({
        message:
          "Departamento y municipio son obligatorios"
      });
    }


    await item.save();


    const perfil =
      await obtenerPerfilCompleto(
        item._id
      );


    return res.status(200).json({
      message:
        "Perfil de damnificado actualizado correctamente",

      perfil
    });

  } catch (error) {
    console.error(
      "Error creando o actualizando perfil de damnificado:",
      error
    );

    return res.status(500).json({
      message:
        "Error al guardar el perfil de damnificado",

      error:
        error.message
    });
  }
};


/*
 * =========================================================
 * CAMBIAR ESTADO DEL PERFIL
 * =========================================================
 *
 * Solo administrador.
 *
 * Cuando realmente cambia el estado,
 * se genera una notificación automática.
 */
exports.updateEstado = async (
  req,
  res
) => {
  try {
    const {
      estado_solicitud
    } = req.body;


    const estadosPermitidos = [
      "pendiente",
      "en_proceso",
      "atendida",
      "cerrada"
    ];


    if (
      !estado_solicitud ||
      !estadosPermitidos.includes(
        estado_solicitud
      )
    ) {
      return res.status(400).json({
        message:
          "Estado de solicitud no válido",

        estados_permitidos:
          estadosPermitidos
      });
    }


    const item =
      await Damnificado.findById(
        req.params.id
      );


    if (!item) {
      return res.status(404).json({
        message:
          "Perfil de damnificado no encontrado"
      });
    }


    const estadoAnterior =
      item.estado_solicitud;


    item.estado_solicitud =
      estado_solicitud;


    await item.save();


    /*
     * =====================================================
     * NOTIFICACIÓN AUTOMÁTICA
     * =====================================================
     *
     * Solo se genera si realmente
     * cambió el estado.
     */
    if (
      estadoAnterior !==
      estado_solicitud
    ) {
      const nombresEstado = {
        pendiente:
          "pendiente",

        en_proceso:
          "en proceso",

        atendida:
          "atendida",

        cerrada:
          "cerrada"
      };


      await crearNotificacion({
        usuario_destino_id:
          item.usuario_id,

        titulo:
          "Actualización de tu perfil",

        mensaje:
          `El estado de tu perfil de damnificado cambió a ${nombresEstado[estado_solicitud]}.`,

        tipo:
          "perfil_damnificado",

        modulo:
          "damnificado",

        recurso_id:
          item._id
      });
    }


    const perfil =
      await obtenerPerfilCompleto(
        item._id
      );


    return res.status(200).json({
      message:
        "Estado del damnificado actualizado correctamente",

      perfil
    });

  } catch (error) {
    console.error(
      "Error actualizando estado del damnificado:",
      error
    );

    return res.status(500).json({
      message:
        "Error al actualizar el estado del damnificado",

      error:
        error.message
    });
  }
};