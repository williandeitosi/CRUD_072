import { Router } from "express";
import {
  confirmAccount,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.get("/confirm", confirmAccount);
router.post("/login", loginUser);

export default router;
