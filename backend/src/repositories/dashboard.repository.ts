import { prisma } from "../config/prisma.js";

export const obtenerUsuarioConPerfiles = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      renter: true,
      owner: true,
    },
  });
};

export const obtenerRentasCliente = async (renterId: string) => {
  return await prisma.rental.count({
    where: { renterId },
  });
};

export const obtenerRentaActivaCliente = async (renterId: string) => {
  return await prisma.rental.findFirst({
    where: { renterId, status: "ACTIVE" },
    include: { moto: true },
    orderBy: { endDate: "asc" },
  });
};

export const obtenerMotosPublicadasPropietario = async (ownerId: string) => {
  return await prisma.moto.count({
    where: { ownerId: ownerId },
  });
};

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
