require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../src/models/User");

async function run() {

  const uri = process.env.MONGO_URI;

  const email =
    process.env.ADMIN_EMAIL || "admin@demo.com";

  const documento =
    process.env.ADMIN_DOCUMENTO || "999999999";

  const pass =
    process.env.ADMIN_PASSWORD || "Admin123*";

  if (!uri) {
    throw new Error("MONGO_URI no está definido");
  }

  await mongoose.connect(uri);

  console.log("✅ Conectado a MongoDB");

  // Buscar si el administrador principal ya existe.
  const existente = await User.findOne({
    $or: [
      { correo: email.toLowerCase() },
      { numero_documento: documento }
    ]
  });

  /*
   * Si ya existe, no creamos otro usuario.
   * Simplemente garantizamos que sea administrador
   * y que tenga la condición de usuario master.
   */
  if (existente) {

    existente.rol = "administrador";
    existente.es_master = true;
    existente.estado = "activo";

    await existente.save();

    console.log("✅ Administrador principal actualizado");
    console.log("📧 Correo:", existente.correo);
    console.log("👑 Usuario master: SÍ");

    await mongoose.disconnect();

    process.exit(0);
  }

  // Si no existe, crear el administrador principal.
  const hash = await bcrypt.hash(pass, 10);

  const admin = await User.create({

    tipo_documento: "CC",

    numero_documento: documento,

    nombre_completo: "Administrador Principal",

    correo: email.toLowerCase(),

    telefono: "0000000000",

    contrasena: hash,

    rol: "administrador",

    es_master: true,

    estado: "activo"
  });

  console.log("✅ Administrador principal creado");
  console.log("📧 Correo:", admin.correo);
  console.log("👑 Usuario master: SÍ");

  await mongoose.disconnect();

  process.exit(0);
}

run().catch(async (error) => {

  console.error(
    "❌ Error creando administrador principal:",
    error.message
  );

  try {
    await mongoose.disconnect();
  } catch (_) {
    // No hacer nada.
  }

  process.exit(1);
});