const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Apoyo a Damnificados",
      version: "1.0.0",
      description: "API RESTful (Node.js + Express + MongoDB) para gestionar usuarios, damnificados, donantes, donaciones, puntos de interés y notificaciones."
    },
    servers: [{ url: "http://127.0.0.1:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    }
  },
  apis: ["./src/routes/*.routes.js"]
};

module.exports = swaggerJSDoc(options);
