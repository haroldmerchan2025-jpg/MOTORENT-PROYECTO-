import { Router } from "express";
import { getMotos, createMoto } from "../controllers/moto.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getMotos);
router.post("/", verificarToken, createMoto);

export default router;