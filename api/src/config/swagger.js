import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Quiz API",
    version: "2.0.0",
    description:
      "API REST de The Quiz of SP : enregistrement idempotent et classement.",
  },
  servers: [
    {
      url: process.env.BASE_URL || "http://localhost:5050",
      description: "API",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
