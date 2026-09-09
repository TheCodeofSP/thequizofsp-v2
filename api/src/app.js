import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import scoreRoutes from "./routes/score.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { connectDB } from "./config/db.js";

const app = express();

app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL || "").split(","),
]
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      const error = new Error("Origine non autorisée.");
      error.statusCode = 403;
      return callback(error);
    },
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());

if (
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_API_DOCS === "true"
) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
}

app.use("/api/scores", scoreRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "The Quiz of SP API",
    version: "2.0.0",
  });
});

app.get("/health", async (req, res, next) => {
  try {
    await connectDB();

    res.status(200).json({
      ok: true,
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
});

// Ces deux middlewares doivent toujours rester en dernier.
app.use(notFound);
app.use(errorHandler);

export default app;
