import { Router } from "express";
import { confirmAccount, registerUser } from "../controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.get("/confirm", confirmAccount);

export default router;
