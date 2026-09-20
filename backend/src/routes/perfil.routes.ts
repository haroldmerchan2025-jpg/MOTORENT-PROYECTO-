import {Router} from "express"
import { verificarToken } from "../middleware/auth.middleware.js"

const router = Router();


router.get("/perfil", verificarToken);
router.patch("/actualizar/perfil", verificarToken)


export default router