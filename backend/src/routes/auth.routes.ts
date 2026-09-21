import { Router } from "express";

// 1. Controladores del Núcleo de Sesión
import { loginUser, registerUser, getMe } from "../controllers/auth.controller.js";

// 2. Controladores de Verificación de Correo
import { verifyEmail, resendVerificationEmail } from "../controllers/verification.controller.js";

// 3. Controladores de Recuperación de Contraseña
import { forgotPassword, resetPassword } from "../controllers/password.controller.js";

// 4. Middleware para proteger rutas que requieren inicio de sesión
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

// RUTAS DE SESIÓN Y PERFIL

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verificarToken, getMe);

// RUTAS DE VERIFICACIÓN DE CORREO
// GET porque el usuario solo hace clic en un enlace desde su bandeja de correo
// El :token captura el código único que viene en la URL
router.get("/verify-email/:token", verifyEmail);

// POST porque enviamos el { email } en el body para solicitar un nuevo enlace
router.post("/resend-verification", resendVerificationEmail);

// RUTAS DE RECUPERACIÓN DE CONTRASEÑA

// POST para enviar el correo del usuario que olvidó su clave
router.post("/forgot-password", forgotPassword);

// POST para enviar el { token, newPassword } y guardar la nueva clave
router.post("/reset-password", resetPassword);

export default router;