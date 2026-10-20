import { prisma } from "../config/prisma.js";

export const olvidoContraseña = async (email: string) => {
    return await prisma.user.findFirst({
        where: { email: email }
    });
}

export const buscarUsuarioPorUsernameOEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email: email }
    });
}

export const actualizarContraseña = async (email: string, nuevaContraseña: string) => {
    return await prisma.user.update({
        where: { email: email },
        data: { password: nuevaContraseña }
    });
}

// restablecer contraseña con token

export const validarToken = async (token: string) => {
    return await prisma.user.findFirst({
      where: {
        resetPasswordToken: String(token),
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });
}

export const actualizarContraseñaConToken = async (token: string, nuevaContraseña: string) => {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: String(token),
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });
}


