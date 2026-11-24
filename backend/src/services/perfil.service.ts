import {
  findOwnerByUserId,
  crearOwner,
  BuscarSolicitudOwner,
  BuscarOwnerPorId,
  AprobarOwner,
  RechazarOwner
} from "../repositories/Perfil.repository.js";
import { AppError } from "../utils/response.util.js";
import type { DatosOwner } from "../repositories/Perfil.repository.js";

export const solicitarOwner = async ( userId: string, datosOwner: DatosOwner) => {

    const existingOwner = await findOwnerByUserId(userId)

    if(existingOwner){
        throw new AppError(
        "Ya tienes un perfil de propietario registrado",
        409
    );
    }return await crearOwner(userId, datosOwner);
    
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

  if (!motivoRechazo.trim()) {
    throw new AppError("Debes proporcionar un motivo de rechazo", 400);
  }

  return await RechazarOwner(id, motivoRechazo);
};