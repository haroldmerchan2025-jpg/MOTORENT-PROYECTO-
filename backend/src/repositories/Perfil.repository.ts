import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";

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
    Prisma.OwnerVerifyCreateInput,
    "id" | "idUser" | "estadoVerificacion" |
    "motivoRechazo" | "fechaVerificacion" |
    "createdAt" | "updatedAt"
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