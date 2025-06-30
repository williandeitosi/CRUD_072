import { Router } from "express";
import { createEventHandler } from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, createEventHandler);

export default router;
