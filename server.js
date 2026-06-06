require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./src/config/db");
const swaggerSpec = require("./src/config/swagger");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/users.routes");
const damnificadoRoutes = require("./src/routes/damnificados.routes");
const donanteRoutes = require("./src/routes/donantes.routes");
const donacionRoutes = require("./src/routes/donaciones.routes");
const productosRoutes = require("./src/routes/productos.routes");
const puntosRoutes = require("./src/routes/puntosInteres.routes");
const notificacionesRoutes = require("./src/routes/notificaciones.routes");

const app = express();
const port = process.env.PORT || 3000;

// Helmet por defecto activa CSP (Content-Security-Policy) y algunas políticas
// que pueden impedir que Swagger UI cargue/expanda correctamente en el navegador.
// Por eso se deshabilitan esas políticas específicas.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("API Apoyo Damnificados OK ✅"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/damnificados", damnificadoRoutes);
app.use("/api/donantes", donanteRoutes);
app.use("/api/donaciones", donacionRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/puntos-interes", puntosRoutes);
app.use("/api/notificaciones", notificacionesRoutes);

app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 API corriendo en http://127.0.0.1:${port}`);
      console.log(`📚 Swagger en http://127.0.0.1:${port}/api-docs`);
    });
  })
  .catch((e) => console.error("❌ No se pudo iniciar:", e.message));
