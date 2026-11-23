import { prisma } from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const findOwnerByUserId = async (userId: string) => {
  return await prisma.owner.findUnique({
    where: { idUser: userId },
  });
};

export const findRenterByUserId = async (userId: string) => {
  return await prisma.renter.findUnique({
    where: { idUser: userId },
  });
};

export type DatosOwner = Omit<
  Prisma.OwnerUncheckedCreateInput,
  | "id"
  | "idUser"
  | "estadoVerificacion"
  | "motivoRechazo"
  | "fechaVerificacion"
  | "createdAt"
  | "updatedAt"
  | "motos"
>;

export const crearOwner = async (
  userId: string,
  datosOwner: DatosOwner
) => {
  return await prisma.owner.create({
    data: {
      ...datosOwner,
      idUser: userId,
      estadoVerificacion: "PENDING"
    }
  });
};

export type DatosRenter = Omit<
  Prisma.RenterUncheckedCreateInput,
  | "id"
  | "idUser"
  | "estadoVerificacion"
  | "motivoRechazo"
  | "fechaVerificacion"
  | "createdAt"
  | "updatedAt"
  | "rentals"
>;

export const crearRenter = async (
  userId: string,
  datosRenter: DatosRenter
) => {
  return await prisma.renter.create({
    data: {
      ...datosRenter,
      idUser: userId,
      estadoVerificacion: "PENDING"
    }
  });
};