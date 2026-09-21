import { type Request, type Response } from "express";
import { prisma } from "../config/prisma.js";
import crypto from "node:crypto";
import { sendVerificationEmail } from "../services/email.service.js";

// ----------------------------------------------------------------------
// 1. VERIFICAR CORREO ELECTRÓNICO (GET /auth/verify-email/:token)
// ----------------------------------------------------------------------
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ ok: false, message: "Token de verificación no proporcionado" });
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: String(token),
        emailVerificationExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "El enlace de verificación es inválido o ha expirado"
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    });

    res.status(200).json({
      ok: true,
      message: "¡Correo electrónico verificado exitosamente!"
    });
  } catch (error) {
    console.error("Error al verificar correo:", error);
    res.status(500).json({ ok: false, message: "Error interno del servidor al verificar correo" });
  }
};

// ----------------------------------------------------------------------
// 2. REENVIAR CORREO DE VERIFICACIÓN (POST /auth/resend-verification)
// ----------------------------------------------------------------------
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ ok: false, message: "El correo es obligatorio" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(200).json({
        ok: true,
        message: "Si el correo está registrado, recibirás un nuevo enlace de verificación."
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        ok: false,
        message: "Tu correo electrónico ya se encuentra verificado."
      });
    }

    const newToken = crypto.randomBytes(32).toString("hex");
    const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: newToken,
        emailVerificationExpires: newExpires
      }
    });

    await sendVerificationEmail(user.email, user.fullName, newToken);

    res.status(200).json({
      ok: true,
      message: "Enlace de verificación reenviado exitosamente."
    });
  } catch (error) {
    console.error("Error al reenviar correo:", error);
    res.status(500).json({ ok: false, message: "Error interno al reenviar correo" });
  }
};