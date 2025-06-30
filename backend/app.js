import express from "express";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/events", eventRoutes);

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
