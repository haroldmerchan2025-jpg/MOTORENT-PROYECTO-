import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", verificarToken, getDashboardStats);

export default router;
