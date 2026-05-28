const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donante = require("../models/Donante");
const Damnificado = require("../models/Damnificado");

function signToken(userId, rol) {
  return jwt.sign({ sub: userId, rol }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

// Auto-registro SOLO DONANTE
exports.register = async (req, res) => {
  try {
    const { tipo_documento, numero_documento, nombre_completo, correo, telefono, contrasena, rol } = req.body;

    if (!tipo_documento || !numero_documento || !nombre_completo || !correo || !telefono || !contrasena || !rol) {
      return res.status(400).json({ message: "Campos obligatorios incompletos" });
    }

    if (rol !== "donante") {
      return res.status(403).json({ message: "Solo se permite auto-registro de Donante. Damnificado debe registrarlo un administrador." });
    }

    const exists = await User.findOne({ $or: [{ correo: correo.toLowerCase() }, { numero_documento }] });
    if (exists) return res.status(409).json({ message: "Correo o documento ya existe" });

    const hash = await bcrypt.hash(contrasena, 10);

    const user = await User.create({
      tipo_documento,
      numero_documento,
      nombre_completo,
      correo: correo.toLowerCase(),
      telefono,
      contrasena: hash,
      rol
    });

    await Donante.create({ usuario_id: user._id });

    const token = signToken(user._id.toString(), user.rol);
    res.status(201).json({ token, user: { id: user._id, nombre_completo: user.nombre_completo, rol: user.rol } });
  } catch (e) {
    res.status(500).json({ message: "Error registrando usuario", error: e.message });
  }
};

// Registro de damnificado SOLO ADMIN
exports.registerDamnificado = async (req, res) => {
  try {
    const { tipo_documento, numero_documento, nombre_completo, correo, telefono, contrasena, ubicacion, necesidades_urgentes, datos_familiares, afectaciones } = req.body;

    if (!tipo_documento || !numero_documento || !nombre_completo || !correo || !telefono || !contrasena || !ubicacion?.departamento || !ubicacion?.municipio) {
      return res.status(400).json({ message: "Campos obligatorios incompletos" });
    }

    const exists = await User.findOne({ $or: [{ correo: correo.toLowerCase() }, { numero_documento }] });
    if (exists) return res.status(409).json({ message: "Correo o documento ya existe" });

    const hash = await bcrypt.hash(contrasena, 10);

    const user = await User.create({
      tipo_documento,
      numero_documento,
      nombre_completo,
      correo: correo.toLowerCase(),
      telefono,
      contrasena: hash,
      rol: "dammificado"
    });

    await Damnificado.create({
      usuario_id: user._id,
      registrado_por: req.user._id,
      ubicacion,
      necesidades_urgentes: Array.isArray(necesidades_urgentes) ? necesidades_urgentes : [],
      datos_familiares: datos_familiares || {},
      afectaciones: afectaciones || {}
    });

    res.status(201).json({ message: "Damnificado registrado", id: user._id });
  } catch (e) {
    res.status(500).json({ message: "Error registrando damnificado", error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, contrasena } = req.body; // correo o numero_documento
    if (!login || !contrasena) return res.status(400).json({ message: "Login y contraseña requeridos" });

    const user = await User.findOne({ $or: [{ correo: login.toLowerCase() }, { numero_documento: login }] });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });
    if (user.estado !== "activo") return res.status(403).json({ message: "Cuenta inactiva" });

    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    user.ultimo_acceso = new Date();
    await user.save();

    const token = signToken(user._id.toString(), user.rol);
    res.json({ token, user: { id: user._id, nombre_completo: user.nombre_completo, rol: user.rol } });
  } catch (e) {
    res.status(500).json({ message: "Error en login", error: e.message });
  }
};
