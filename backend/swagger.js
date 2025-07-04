import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event API",
      version: "1.0.0",
      description: "Documentação da API de Eventos e Usuários",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    tags: [
      {
        name: "users",
        description: "Endpoints de cadastro, login e confirmação de usuários",
      },
      {
        name: "events",
        description: "Endpoints de criação e listagem de eventos",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
