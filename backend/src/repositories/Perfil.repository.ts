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

export const BuscarOwnerPorId = async (id: string) => {
  return await prisma.owner.findUnique({
    where: { id },
  });
};

export const BuscarRenterPorId = async (id: string) => {
  return await prisma.renter.findUnique({
    where: { id },
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

export const crearOwner = async (userId: string, datosOwner: DatosOwner) => {
  return await prisma.owner.upsert({
    where: { idUser: userId },
    create: {
      ...datosOwner,
      idUser: userId,
      estadoVerificacion: "PENDING",
    },
    update: {
      ...datosOwner,
      estadoVerificacion: "PENDING",
      motivoRechazo: null,
      fechaVerificacion: null,
    },
  });
};

export const BuscarSolicitudOwner = async () => {
  return await prisma.owner.findMany({
    where: {
      estadoVerificacion: "PENDING",
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true,
          username: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const AprobarOwner = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const owner = await tx.owner.update({
      where: { id },
      data: {
        estadoVerificacion: "APPROVED",
        motivoRechazo: null,
        fechaVerificacion: new Date(),
      },
    });

    const userActual = await tx.user.findUnique({ where: { id: owner.idUser } });
    if (userActual && userActual.role !== "ADMIN") {
      await tx.user.update({
        where: { id: owner.idUser },
        data: {
          role: "OWNER",
        },
      });
    }

    return owner;
  });
};

export const RechazarOwner = async (id: string, motivoRechazo: string) => {
  return await prisma.owner.update({
    where: { id },
    data: {
      estadoVerificacion: "REJECTED",
      motivoRechazo,
      fechaVerificacion: new Date(),
    },
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

export const crearRenter = async (userId: string, datosRenter: DatosRenter) => {
  return await prisma.renter.upsert({
    where: { idUser: userId },
    create: {
      ...datosRenter,
      idUser: userId,
      estadoVerificacion: "PENDING",
    },
    update: {
      ...datosRenter,
      estadoVerificacion: "PENDING",
      motivoRechazo: null,
      fechaVerificacion: null,
    },
  });
};

export const BuscarSolicitudRenter = async () => {
  return await prisma.renter.findMany({
    where: {
      estadoVerificacion: "PENDING",
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true,
          username: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const AprobarRenter = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const renter = await tx.renter.update({
      where: { id },
      data: {
        estadoVerificacion: "APPROVED",
        motivoRechazo: null,
        fechaVerificacion: new Date(),
      },
    });

    const userActual = await tx.user.findUnique({ where: { id: renter.idUser } });
    if (userActual && userActual.role === "USER") {
      await tx.user.update({
        where: { id: renter.idUser },
        data: {
          role: "RENTER",
        },
      });
    }

    return renter;
  });
};

export const RechazarRenter = async (id: string, motivoRechazo: string) => {
  return await prisma.renter.update({
    where: { id },
    data: {
      estadoVerificacion: "REJECTED",
      motivoRechazo,
      fechaVerificacion: new Date(),
    },
  });
};
