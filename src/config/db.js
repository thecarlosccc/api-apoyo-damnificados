const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI no está definido en .env");

  await mongoose.connect(uri);

  mongoose.connection.on("connected", () => console.log(" MongoDB conectado"));
  mongoose.connection.on("error", (err) => console.error(" MongoDB error:", err.message));
  mongoose.connection.on("disconnected", () => console.warn(" MongoDB desconectado"));
}

module.exports = connectDB;
