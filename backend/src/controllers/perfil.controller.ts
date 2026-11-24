import type { Request, Response } from "express";
import {
  solicitarOwner,
  ObtenerSolicitudesOwner,
  AprobarSolicitudOwner,
  RechazarSolicitudOwner
} from "../services/perfil.service.js";
import { AppError } from "../utils/response.util.js";

export const solicitarPerfilOwner = async (req: Request, res: Response) => {

  try {
    const userId = req.usuario.id;

    const nuevoOwner = await solicitarOwner(
      userId,
      req.body
    );

    return res.status(201).json({
      message: "Solicitud de perfil Owner creada correctamente",
      data: nuevoOwner
    });

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};

export const ObtenerSolicitudesOwnerController = async (
  req: Request,
  res: Response
) => {
  try {
    const solicitudes = await ObtenerSolicitudesOwner();

    return res.status(200).json({
      message: "Solicitudes OWNER obtenidas correctamente",
      data: solicitudes
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las solicitudes OWNER"
    });
  }
};

export const AprobarSolicitudOwnerController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const ownerAprobado = await AprobarSolicitudOwner(id);

    return res.status(200).json({
      message: "Solicitud OWNER aprobada correctamente",
      data: ownerAprobado
    });

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};

export const RechazarSolicitudOwnerController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { motivoRechazo } = req.body;

    const ownerRechazado = await RechazarSolicitudOwner(
      id,
      motivoRechazo
    );

    return res.status(200).json({
      message: "Solicitud OWNER rechazada correctamente",
      data: ownerRechazado
    });

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};