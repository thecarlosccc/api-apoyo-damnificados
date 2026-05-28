require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../src/models/User");

async function run() {
  const uri = process.env.MONGO_URI;
  const email = process.env.ADMIN_EMAIL || "admin@demo.com";
  const documento = process.env.ADMIN_DOCUMENTO || "999999999";
  const pass = process.env.ADMIN_PASSWORD || "Admin123*";

  if (!uri) throw new Error("MONGO_URI no está definido");

  await mongoose.connect(uri);
  console.log("✅ Conectado a MongoDB");

  const exists = await User.findOne({ $or: [{ correo: email.toLowerCase() }, { numero_documento: documento }] });
  if (exists) {
    console.log("ℹ️ Admin ya existe:", exists.correo);
    process.exit(0);
  }

  const hash = await bcrypt.hash(pass, 10);

  const admin = await User.create({
    tipo_documento: "CC",
    numero_documento: documento,
    nombre_completo: "Administrador",
    correo: email.toLowerCase(),
    telefono: "0000000000",
    contrasena: hash,
    rol: "administrador",
    estado: "activo"
  });

  console.log("✅ Admin creado:", admin.correo);
  console.log("👉 Login:", email, " / Password:", pass);
  process.exit(0);
}

run().catch(e => {
  console.error("❌ Error seed:", e.message);
  process.exit(1);
});
