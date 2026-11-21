import { prisma } from "../config/prisma.js";

// ====== MÉTODOS PARA MOTOS ====== //

export const obtenerTodasLasMotos = async () => {
  return await prisma.moto.findMany();
};

export const buscarMotoPorPlaca = async (placa: string) => {
  return await prisma.moto.findFirst({
    where: { licensePlate: placa },
  });
};

export const crearMoto = async (datosMoto: any) => {
  return await prisma.moto.create({
    data: datosMoto,
  });
};

// ====== MÉTODOS PARA OWNER (Dueño) ====== //

export const buscarOwnerPorUserId = async (userId: string) => {
  return await prisma.owner.findUnique({
    where: { idUser: userId },
  });
};

export const crearOwnerPendiente = async (userId: string) => {
  return await prisma.owner.create({
    data: {
      idUser: userId,
    },
  });
};
