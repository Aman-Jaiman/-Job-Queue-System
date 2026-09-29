import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const routeFiles = path
  .resolve(path.dirname(fileURLToPath(import.meta.url)), "../routes/*.js")
  .replaceAll("\\", "/");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Job Queue System API",
      version: "1.0.0",
      description: "Production Level Job Queue System using BullMQ and Redis",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [routeFiles],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
