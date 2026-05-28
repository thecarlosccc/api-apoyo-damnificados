const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Token requerido" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-contrasena");
    if (!user) return res.status(401).json({ message: "Usuario no válido" });
    if (user.estado !== "activo") return res.status(403).json({ message: "Cuenta inactiva" });

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: "Token inválido" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const rol = req.user?.rol;
    if (!rol || !roles.includes(rol)) return res.status(403).json({ message: "No autorizado" });
    next();
  };
}

module.exports = { auth, requireRole };
