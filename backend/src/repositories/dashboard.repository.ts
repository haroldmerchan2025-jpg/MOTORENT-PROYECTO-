import { prisma } from "../config/prisma.js";

export const obtenerUsuarioConPerfiles = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      client: true,
      owner: true,
    },
  });
};

export const obtenerRentasCliente = async (clientId: string) => {
  return await prisma.rental.count({
    where: { clientId: clientId },
  });
}

export const obtenerRentaActivaCliente = async (clientId: string) => {
    return await prisma.rental.findFirst({
      where: { clientId: clientId, status: "ACTIVE" },
      include: { moto: true },
      orderBy: { endDate: "asc" }
    });
  }

export const obtenerMotosPublicadasPropietario = async (ownerId: string) => {
  return await prisma.moto.count({
    where: { ownerId: ownerId },
  });
}

export const obtenerRentasDelMesPropietario = async (ownerId: string, inicioDeMes: Date) => {
  return await prisma.rental.findMany({
    where: {
      moto: { ownerId: ownerId },
      startDate: { gte: inicioDeMes },
      status: { in: ["ACTIVE", "COMPLETED"] },
    },
    select: { ownerEarnings: true },
  });
};