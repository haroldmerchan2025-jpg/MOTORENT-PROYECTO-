import {
  findOwnerByUserId,
  findRenterByUserId,
  crearOwner,
  crearRenter,
  BuscarSolicitudOwner,
  BuscarOwnerPorId,
  AprobarOwner,
  RechazarOwner,
  BuscarSolicitudRenter,
  BuscarRenterPorId,
  AprobarRenter,
  RechazarRenter,
} from "../repositories/Perfil.repository.js";
import { AppError } from "../utils/response.util.js";
import type { DatosOwner, DatosRenter } from "../repositories/Perfil.repository.js";

export const solicitarOwner = async (userId: string, datosOwner: DatosOwner) => {
  const existingOwner = await findOwnerByUserId(userId);

  if (existingOwner && existingOwner.estadoVerificacion !== "REJECTED") {
    throw new AppError(
      "Ya tienes un perfil de propietario registrado o en revisión",
      409
    );
  }
  return await crearOwner(userId, datosOwner);
};

export const ObtenerSolicitudesOwner = async () => {
  return await BuscarSolicitudOwner();
};

export const AprobarSolicitudOwner = async (id: string) => {
  const owner = await BuscarOwnerPorId(id);

  if (!owner) {
    throw new AppError("La solicitud OWNER no existe", 404);
  }

  if (owner.estadoVerificacion !== "PENDING") {
    throw new AppError("Esta solicitud ya fue procesada", 409);
  }

  return await AprobarOwner(id);
};

export const RechazarSolicitudOwner = async (
  id: string,
  motivoRechazo: string
) => {
  const owner = await BuscarOwnerPorId(id);

  if (!owner) {
    throw new AppError("La solicitud OWNER no existe", 404);
  }

  if (owner.estadoVerificacion !== "PENDING") {
    throw new AppError("Esta solicitud ya fue procesada", 409);
  }

  if (!motivoRechazo || !motivoRechazo.trim()) {
    throw new AppError("Debes proporcionar un motivo de rechazo", 400);
  }

  return await RechazarOwner(id, motivoRechazo.trim());
};

export const solicitarRenter = async (userId: string, datosRenter: DatosRenter) => {
  const existingRenter = await findRenterByUserId(userId);

  if (existingRenter && existingRenter.estadoVerificacion !== "REJECTED") {
    throw new AppError(
      "Ya tienes un perfil de arrendatario registrado o en revisión",
      409
    );
  }

  return await crearRenter(userId, datosRenter);
};

export const ObtenerSolicitudesRenter = async () => {
  return await BuscarSolicitudRenter();
};

export const AprobarSolicitudRenter = async (id: string) => {
  const renter = await BuscarRenterPorId(id);

  if (!renter) {
    throw new AppError("La solicitud RENTER no existe", 404);
  }

  if (renter.estadoVerificacion !== "PENDING") {
    throw new AppError("Esta solicitud ya fue procesada", 409);
  }

  return await AprobarRenter(id);
};

export const RechazarSolicitudRenter = async (
  id: string,
  motivoRechazo: string
) => {
  const renter = await BuscarRenterPorId(id);

  if (!renter) {
    throw new AppError("La solicitud RENTER no existe", 404);
  }

  if (renter.estadoVerificacion !== "PENDING") {
    throw new AppError("Esta solicitud ya fue procesada", 409);
  }

  if (!motivoRechazo || !motivoRechazo.trim()) {
    throw new AppError("Debes proporcionar un motivo de rechazo", 400);
  }

  return await RechazarRenter(id, motivoRechazo.trim());
};
