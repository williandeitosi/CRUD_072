import { Router } from "express";
import {
  createEventHandler,
  deleteEventHandler,
  listEventsHandler,
  updateEventHandler,
} from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, createEventHandler);
router.get("/all", authenticateToken, listEventsHandler);
router.put("/:id", authenticateToken, updateEventHandler);
router.delete("/:id", authenticateToken, deleteEventHandler);

export default router;
