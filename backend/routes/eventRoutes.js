import { Router } from "express";
import {
  createEventHandler,
  listAllEventsByUser,
} from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, createEventHandler);
router.get("/all", authenticateToken, listAllEventsByUser);

export default router;
