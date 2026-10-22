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
const categoriasRoutes = require("./src/routes/categorias.routes");

const incidenciasRoutes = require("./src/routes/incidencias.routes");

const solicitudesApoyoRoutes = require(
  "./src/routes/solicitudesApoyo.routes"
);

const app = express();

const port = process.env.PORT || 3000;


/*
 * =========================================================
 * MIDDLEWARES GENERALES
 * =========================================================
 */

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN ||
      "*",
  })
);

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  morgan("dev")
);


/*
 * =========================================================
 * SWAGGER / OPENAPI
 * =========================================================
 */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerSpec
  )
);


/*
 * =========================================================
 * RUTA PRINCIPAL
 * =========================================================
 */

app.get(
  "/",
  (req, res) => {
    return res.send(
      "API Apoyo Damnificados OK ✅"
    );
  }
);


/*
 * =========================================================
 * RUTAS DE LA API
 * =========================================================
 */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/damnificados",
  damnificadoRoutes
);

app.use(
  "/api/donantes",
  donanteRoutes
);

app.use(
  "/api/donaciones",
  donacionRoutes
);

app.use(
  "/api/productos",
  productosRoutes
);

app.use(
  "/api/puntos-interes",
  puntosRoutes
);

app.use(
  "/api/notificaciones",
  notificacionesRoutes
);

app.use(
  "/api/categorias",
  categoriasRoutes
);


/*
 * =========================================================
 * INCIDENCIAS
 * =========================================================
 */

app.use(
  "/api/incidencias",
  incidenciasRoutes
);


/*
 * =========================================================
 * SOLICITUDES DE APOYO
 * =========================================================
 */

app.use(
  "/api/solicitudes-apoyo",
  solicitudesApoyoRoutes
);


/*
 * =========================================================
 * RUTA NO ENCONTRADA
 * =========================================================
 */

app.use(
  (req, res) => {
    return res
      .status(404)
      .json({
        message:
          "Ruta no encontrada",
      });
  }
);


/*
 * =========================================================
 * MANEJO GENERAL DE ERRORES
 * =========================================================
 */

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "❌ Error:",
      err
    );

    return res
      .status(500)
      .json({
        message:
          "Error interno del servidor",
      });
  }
);


/*
 * =========================================================
 * CONEXIÓN A MONGODB E INICIO DEL SERVIDOR
 * =========================================================
 */

connectDB()
  .then(() => {
    app.listen(
      port,
      () => {
        console.log(
          `🚀 API corriendo en http://127.0.0.1:${port}`
        );

        console.log(
          `📚 Swagger en http://127.0.0.1:${port}/api-docs`
        );
      }
    );
  })
  .catch(
    (error) => {
      console.error(
        "❌ No se pudo iniciar:",
        error.message
      );
    }
  );