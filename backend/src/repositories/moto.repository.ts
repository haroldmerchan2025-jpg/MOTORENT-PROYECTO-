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
// Nota: La lógica de la moto requiere validar y crear dueños, por eso están aquí.
// Si tuvieras un owner.repository separado, irían allá, pero para empezar aquí está perfecto.

export const buscarOwnerPorUserId = async (userId: string) => {
  return await prisma.owner.findUnique({
    where: { userId },
  });
};

export const crearOwnerPendiente = async (userId: string) => {
  return await prisma.owner.create({
    data: {
      userId,
      bankName: "Pendiente",
      accountType: "Pendiente",
      accountNumber: "Pendiente",
    },
  });
};
