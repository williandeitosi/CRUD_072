import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(globalLimiter);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
setupSwagger(app);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

export default app;
