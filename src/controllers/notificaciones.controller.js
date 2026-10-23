const Notificacion = require(
  "../models/Notificacion"
);


/*
 * =========================================================
 * CONSULTAR MIS NOTIFICACIONES
 * =========================================================
 *
 * Usuario autenticado.
 *
 * Filtros opcionales:
 *
 * ?leido=true
 * ?leido=false
 * ?tipo=incidencia_estado
 */
exports.my = async (
  req,
  res
) => {
  try {
    const filtro = {
      usuario_destino_id:
        req.user._id
    };

    if (
      req.query.leido !==
      undefined
    ) {
      if (
        req.query.leido !==
          "true" &&
        req.query.leido !==
          "false"
      ) {
        return res.status(400).json({
          message:
            "El parámetro leido debe ser true o false"
        });
      }

      filtro.leido =
        req.query.leido ===
        "true";
    }

    if (req.query.tipo) {
      filtro.tipo =
        req.query.tipo;
    }

    const items =
      await Notificacion.find(
        filtro
      )
        .sort({
          fecha_envio: -1
        });

    const noLeidas =
      await Notificacion.countDocuments({
        usuario_destino_id:
          req.user._id,

        leido: false
      });

    return res.status(200).json({
      total:
        items.length,

      no_leidas:
        noLeidas,

      notificaciones:
        items
    });

  } catch (error) {
    console.error(
      "Error consultando notificaciones:",
      error
    );

    return res.status(500).json({
      message:
        "Error al consultar las notificaciones",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * MARCAR UNA NOTIFICACIÓN COMO LEÍDA
 * =========================================================
 *
 * Solo puede marcarse como leída una
 * notificación perteneciente al usuario
 * autenticado.
 */
exports.markRead = async (
  req,
  res
) => {
  try {
    const item =
      await Notificacion.findOne({
        _id:
          req.params.id,

        usuario_destino_id:
          req.user._id
      });

    if (!item) {
      return res.status(404).json({
        message:
          "Notificación no encontrada"
      });
    }

    /*
     * Si ya estaba leída, no se altera
     * innecesariamente la fecha.
     */
    if (!item.leido) {
      item.leido =
        true;

      item.fecha_lectura =
        new Date();

      await item.save();
    }

    return res.status(200).json({
      message:
        "Notificación marcada como leída",

      notificacion:
        item
    });

  } catch (error) {
    console.error(
      "Error marcando notificación como leída:",
      error
    );

    return res.status(500).json({
      message:
        "Error al marcar la notificación como leída",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * MARCAR TODAS COMO LEÍDAS
 * =========================================================
 *
 * Usuario autenticado.
 */
exports.markAllRead = async (
  req,
  res
) => {
  try {
    const fechaLectura =
      new Date();

    const resultado =
      await Notificacion.updateMany(
        {
          usuario_destino_id:
            req.user._id,

          leido: false
        },
        {
          $set: {
            leido: true,
            fecha_lectura:
              fechaLectura
          }
        }
      );

    return res.status(200).json({
      message:
        "Todas las notificaciones fueron marcadas como leídas",

      modificadas:
        resultado.modifiedCount
    });

  } catch (error) {
    console.error(
      "Error marcando todas las notificaciones:",
      error
    );

    return res.status(500).json({
      message:
        "Error al marcar las notificaciones como leídas",
      error: error.message
    });
  }
};


/*
 * =========================================================
 * FUNCIÓN INTERNA PARA CREAR NOTIFICACIONES
 * =========================================================
 *
 * Esta función NO se expone como endpoint.
 *
 * Será utilizada desde:
 * - incidencias
 * - solicitudes de apoyo
 * - donaciones
 * - perfil de damnificados
 */
exports.crearNotificacion =
  async ({
    usuario_destino_id,
    titulo,
    mensaje,
    tipo =
      "alerta_general",
    modulo =
      "general",
    recurso_id =
      null
  }) => {

    try {
      if (
        !usuario_destino_id ||
        !mensaje
      ) {
        throw new Error(
          "usuario_destino_id y mensaje son obligatorios"
        );
      }

      const notificacion =
        await Notificacion.create({
          usuario_destino_id,

          titulo:
            titulo ||
            "Notificación",

          mensaje,

          tipo,

          referencia: {
            modulo,
            recurso_id
          }
        });

      return notificacion;

    } catch (error) {
      /*
       * Importante:
       *
       * Una falla en notificaciones NO debe
       * impedir la operación principal.
       *
       * Ejemplo:
       * si una donación se entrega correctamente
       * y falla la notificación, no debemos
       * revertir la entrega.
       */
      console.error(
        "Error creando notificación:",
        error
      );

      return null;
    }
  };