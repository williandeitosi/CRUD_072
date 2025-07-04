import express from "express";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { setupSwagger } from "./swagger.js";

const app = express();

app.use(express.json());
setupSwagger(app); // habilita /api-docs
app.use("/users", userRoutes);
app.use("/events", eventRoutes);

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
