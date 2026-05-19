import { Router } from "express";
import { login, me, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authMiddleware, me);

export default router;
