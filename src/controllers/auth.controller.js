const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Donante = require("../models/Donante");

function signToken(userId, rol) {
  return jwt.sign(
    {
      sub: userId,
      rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h"
    }
  );
}

/*
 * AUTORREGISTRO
 *
 * Permitidos:
 * - donante
 * - damnificado
 *
 * Prohibido:
 * - administrador
 */
exports.register = async (req, res) => {
  try {
    const {
      tipo_documento,
      numero_documento,
      nombre_completo,
      correo,
      telefono,
      contrasena,
      rol
    } = req.body;

    if (
      !tipo_documento ||
      !numero_documento ||
      !nombre_completo ||
      !correo ||
      !telefono ||
      !contrasena ||
      !rol
    ) {
      return res.status(400).json({
        message: "Campos obligatorios incompletos"
      });
    }

    if (
      rol !== "donante" &&
      rol !== "damnificado"
    ) {
      return res.status(403).json({
        message:
          "No está permitido registrar administradores desde la aplicación"
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

    const user = await User.create({
      tipo_documento,
      numero_documento,
      nombre_completo,
      correo: correo.toLowerCase(),
      telefono,
      contrasena: hash,
      rol,
      es_master: false,
      estado: "activo"
    });

    if (rol === "donante") {
      await Donante.create({
        usuario_id: user._id
      });
    }

    const token = signToken(
      user._id.toString(),
      user.rol
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",

      token,

      user: {
        id: user._id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error(
      "Error registrando usuario:",
      error
    );

    return res.status(500).json({
      message: "Error registrando usuario",
      error: error.message
    });
  }
};


/*
 * LOGIN
 *
 * Puede utilizar:
 * - correo
 * - número de documento
 */
exports.login = async (req, res) => {
  try {
    const {
      login,
      contrasena
    } = req.body;

    if (!login || !contrasena) {
      return res.status(400).json({
        message:
          "Login y contraseña requeridos"
      });
    }

    const user = await User.findOne({
      $or: [
        {
          correo: login.toLowerCase()
        },
        {
          numero_documento: login
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas"
      });
    }

    if (user.estado !== "activo") {
      return res.status(403).json({
        message: "Cuenta inactiva"
      });
    }

    const passwordCorrecta =
      await bcrypt.compare(
        contrasena,
        user.contrasena
      );

    if (!passwordCorrecta) {
      return res.status(401).json({
        message: "Credenciales inválidas"
      });
    }

    user.ultimo_acceso = new Date();

    await user.save();

    const token = signToken(
      user._id.toString(),
      user.rol
    );

    return res.json({
      token,

      user: {
        id: user._id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        rol: user.rol,
        es_master: user.es_master
      }
    });

  } catch (error) {
    console.error(
      "Error en login:",
      error
    );

    return res.status(500).json({
      message: "Error en login",
      error: error.message
    });
  }
};