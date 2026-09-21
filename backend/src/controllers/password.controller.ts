import { type Request, type Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { sendPasswordResetEmail } from "../services/email.service.js";

// ----------------------------------------------------------------------
// 1. SOLICITAR RECUPERACIÓN DE CONTRASEÑA (POST /auth/forgot-password)
// ----------------------------------------------------------------------
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ ok: false, message: "Debes ingresar tu correo electrónico" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(200).json({
        ok: true,
        message: "Si el correo está registrado, te hemos enviado un enlace para restablecer tu contraseña."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validez

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    await sendPasswordResetEmail(user.email, user.fullName, resetToken);

    res.status(200).json({
      ok: true,
      message: "Si el correo está registrado, te hemos enviado un enlace para restablecer tu contraseña."
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ ok: false, message: "Error interno al solicitar recuperación de clave" });
  }
};

// ----------------------------------------------------------------------
// 2. RESTABLECER CONTRASEÑA CON TOKEN (POST /auth/reset-password)
// ----------------------------------------------------------------------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ ok: false, message: "Token y nueva contraseña son obligatorios" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#$%&@?¿/!¡]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña no cumple los requisitos (8-16 caracteres, mayúscula, minúscula, número y símbolo)"
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: String(token),
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "El enlace para restablecer la contraseña es inválido o ya ha vencido"
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.status(200).json({
      ok: true,
      message: "¡Contraseña restablecida con éxito! Ya puedes iniciar sesión con tu nueva contraseña."
    });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ ok: false, message: "Error interno al restablecer la contraseña" });
  }
};