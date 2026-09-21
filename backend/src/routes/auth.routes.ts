import {Router} from 'express';
import { loginUser, registerUser, getMe } from '../controllers/auth.controller.js';
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router(); 

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verificarToken, getMe);


export default router;