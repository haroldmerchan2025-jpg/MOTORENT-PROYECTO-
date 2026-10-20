import { prisma } from "../config/prisma.js";

// ======================================================================
// REPOSITORIO DE VERIFICACIÓN (Acceso exclusivo a Base de Datos con Prisma)
// ======================================================================

export const buscarUsuarioPorToken = async (token: string) => {
  return await prisma.user.findFirst({
    where: {
      emailVerificationToken: String(token),
      emailVerificationExpires: {
        gt: new Date(),
      },
    },
  });
};

export const marcarCorreoComoVerificado = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });
};

export const buscarUsuarioPorEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const guardarNuevoTokenVerificacion = async (
  userId: string,
  token: string,
  expires: Date
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    },
  });
};
