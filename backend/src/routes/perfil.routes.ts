import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { solicitarPerfilOwner } from "../controllers/Perfil.controller.js";

const router = Router();


router.post("/owner", verificarToken, solicitarPerfilOwner);

export default router;