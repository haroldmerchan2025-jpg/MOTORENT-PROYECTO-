import { Router } from "express";
import { verificarToken } from "../middleware/auth.middleware.js";
import { solicitarPerfilOwner, solicitarPerfilRenter } from "../controllers/perfil.controller.js";

const router = Router();

router.post("/owner", verificarToken, solicitarPerfilOwner);
router.post("/renter", verificarToken, solicitarPerfilRenter);

export default router;