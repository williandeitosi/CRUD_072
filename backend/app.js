import express from "express";
import rateLimit from "express-rate-limit";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { setupSwagger } from "./swagger.js";

const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

app.use(globalLimiter);

app.use(express.json());
setupSwagger(app); // habilita /api-docs
app.use("/users", userRoutes);
app.use("/events", eventRoutes);

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
