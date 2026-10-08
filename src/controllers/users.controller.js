const bcrypt = require("bcryptjs");
const User = require("../models/User");


/*
 * LISTAR USUARIOS
 */
exports.list = async (req, res) => {
  try {
    const users = await User.find()
      .select("-contrasena")
      .sort({ fecha_registro: -1 });

    return res.json(users);

  } catch (error) {
    return res.status(500).json({
      message: "Error consultando usuarios",
      error: error.message
    });
  }
};


/*
 * CONSULTAR USUARIO POR ID
 */
exports.get = async (req, res) => {
  try {
    const usuario = await User.findById(
      req.params.id
    ).select("-contrasena");

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    return res.json(usuario);

  } catch (error) {
    return res.status(500).json({
      message: "Error consultando usuario",
      error: error.message
    });
  }
};


/*
 * ACTUALIZAR USUARIO
 *
 * Un administrador normal puede modificar:
 * - nombre
 * - teléfono
 * - estado
 *
 * El rol solamente puede modificarlo el usuario master.
 *
 * es_master nunca puede modificarse desde este endpoint.
 */
exports.update = async (req, res) => {
  try {
    const usuario = await User.findById(
      req.params.id
    );

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    /*
     * Nunca permitir modificar es_master
     * desde una petición normal.
     */
    if (req.body.es_master !== undefined) {
      return res.status(403).json({
        message:
          "La condición de usuario master no puede modificarse desde este endpoint"
      });
    }

    /*
     * Si se intenta modificar el rol,
     * solamente el administrador master puede hacerlo.
     */
    if (
      req.body.rol !== undefined &&
      req.body.rol !== usuario.rol
    ) {
      if (req.user?.es_master !== true) {
        return res.status(403).json({
          message:
            "Solo el administrador principal puede modificar roles"
        });
      }

      const rolesPermitidos = [
        "donante",
        "damnificado",
        "administrador"
      ];

      if (!rolesPermitidos.includes(req.body.rol)) {
        return res.status(400).json({
          message: "Rol no válido"
        });
      }

      usuario.rol = req.body.rol;
    }

    if (req.body.nombre_completo !== undefined) {
      usuario.nombre_completo =
        req.body.nombre_completo;
    }

    if (req.body.telefono !== undefined) {
      usuario.telefono =
        req.body.telefono;
    }

    if (req.body.estado !== undefined) {
      const estadosPermitidos = [
        "activo",
        "inactivo"
      ];

      if (!estadosPermitidos.includes(
        req.body.estado
      )) {
        return res.status(400).json({
          message: "Estado no válido"
        });
      }

      /*
       * El administrador principal
       * no puede ser desactivado.
       */
      if (
        usuario.es_master === true &&
        req.body.estado === "inactivo"
      ) {
        return res.status(403).json({
          message:
            "El administrador principal no puede ser desactivado"
        });
      }

      usuario.estado = req.body.estado;
    }

    await usuario.save();

    const usuarioSeguro = await User.findById(
      usuario._id
    ).select("-contrasena");

    return res.json(usuarioSeguro);

  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando usuario",
      error: error.message
    });
  }
};


/*
 * CREAR ADMINISTRADOR
 *
 * Solamente puede ejecutar esta función
 * el administrador principal (master).
 */
exports.createAdmin = async (req, res) => {
  try {
    const {
      tipo_documento,
      numero_documento,
      nombre_completo,
      correo,
      telefono,
      contrasena
    } = req.body;

    if (
      !tipo_documento ||
      !numero_documento ||
      !nombre_completo ||
      !correo ||
      !telefono ||
      !contrasena
    ) {
      return res.status(400).json({
        message: "Campos obligatorios incompletos"
      });
    }

    const exists = await User.findOne({
      $or: [
        {
          correo: correo.toLowerCase()
        },
        {
          numero_documento
        }
      ]
    });

    if (exists) {
      return res.status(409).json({
        message:
          "El correo o número de documento ya se encuentra registrado"
      });
    }

    const hash = await bcrypt.hash(
      contrasena,
      10
    );

    const admin = await User.create({
      tipo_documento,
      numero_documento,
      nombre_completo,
      correo: correo.toLowerCase(),
      telefono,
      contrasena: hash,
      rol: "administrador",
      es_master: false,
      estado: "activo"
    });

    return res.status(201).json({
      message:
        "Administrador creado correctamente",

      user: {
        id: admin._id,
        nombre_completo:
          admin.nombre_completo,
        correo: admin.correo,
        rol: admin.rol,
        es_master: admin.es_master
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error creando administrador",
      error: error.message
    });
  }
};


/*
 * ELIMINACIÓN LÓGICA
 *
 * No eliminamos físicamente el documento.
 * El usuario queda inactivo.
 */
exports.remove = async (req, res) => {
  try {
    const usuario = await User.findById(
      req.params.id
    );

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    if (usuario.es_master === true) {
      return res.status(403).json({
        message:
          "El administrador principal no puede eliminarse"
      });
    }

    usuario.estado = "inactivo";

    await usuario.save();

    return res.json({
      message:
        "Usuario desactivado correctamente"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error desactivando usuario",
      error: error.message
    });
  }
};