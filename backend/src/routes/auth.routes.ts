import { Router } from "express";

// 1. Controladores del Núcleo de Sesión
import {  newUser } from "../controllers/auth.controller.js";
import { loginUser } from "../controllers/auth-login.controller.js";
import { getMe } from "../controllers/auth-me.controller.js";

//  controladores de Verificación de Correo
import { verifyEmail, resendVerificationEmail } from "../controllers/verification.controller.js";

//  controladores de Recuperación de Contraseña
import { forgotPassword, resetPassword } from "../controllers/password.controller.js";

//  middleware para proteger rutas que requieren inicio de sesión
import { verificarToken } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validateRegisterData.js";
import { validateLoginData } from "../middleware/validateLoginData.middleware.js";

const router = Router();

// RUTAS DE SESIÓN Y PERFIL

router.post("/register", validateData,newUser);
router.post("/login", validateLoginData,loginUser);
router.get("/me", verificarToken, getMe);

// RUTAS DE VERIFICACIÓN DE CORREO
router.get("/verify-email/:token", verifyEmail);

// POST porque enviamos el email en el body para solicitar un nuevo enlace
router.post("/resend-verification", resendVerificationEmail);

// RUTAS DE RECUPERACIÓN DE CONTRASEÑA

// POST para enviar el correo del usuario que olvidó su clave
router.post("/forgot-password", forgotPassword);

// POST para enviar el { token, newPassword } y guardar la nueva clave
router.post("/reset-password", resetPassword);
    
export default router;