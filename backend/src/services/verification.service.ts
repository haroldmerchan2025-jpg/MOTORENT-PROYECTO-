import * as verificationRepo from "../repositories/verification.repository.js";
import crypto from "node:crypto";
import { sendVerificationEmail } from "./email.service.js";

// ======================================================================
// SERVICIO DE VERIFICACIÓN (Lógica y Reglas de Negocio)
// ======================================================================

export const verificarCorreoConToken = async (token: string) => {
  if (!token) {
    throw new Error("Token de verificación no proporcionado");
  }

  // 1. Le pide al Repositorio buscar el usuario con token válido (no vencido)
  const user = await verificationRepo.buscarUsuarioPorToken(token);

  if (!user) {
    throw new Error("El enlace de verificación es inválido o ha expirado");
  }

  // 2. Le pide al Repositorio marcar el correo como verificado y limpiar tokens
  await verificationRepo.marcarCorreoComoVerificado(user.id);

  return { mensaje: "¡Correo electrónico verificado exitosamente!" };
};

export const reenviarCorreoVerificacion = async (email: string) => {
  if (!email) {
    throw new Error("El correo es obligatorio");
  }

  // 1. Busca si el usuario existe
  const user = await verificationRepo.buscarUsuarioPorEmail(email);

  // Por seguridad: si no existe, devolvemos mensaje genérico sin lanzar error
  if (!user) {
    return {
      mensaje: "Si el correo está registrado, recibirás un nuevo enlace de verificación.",
    };
  }

  // 2. Si ya está verificado, lanzamos advertencia de negocio
  if (user.isEmailVerified) {
    throw new Error("Tu correo electrónico ya se encuentra verificado.");
  }

  // 3. Generamos token criptográfico seguro y expiración de 24 horas
  const newToken = crypto.randomBytes(32).toString("hex");
  const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // 4. Guardamos en BD a través del Repositorio
  await verificationRepo.guardarNuevoTokenVerificacion(user.id, newToken, newExpires);

  // 5. Enviamos el correo electrónico
  await sendVerificationEmail(user.email, user.fullName, newToken);

  return { mensaje: "Enlace de verificación reenviado exitosamente." };
};
