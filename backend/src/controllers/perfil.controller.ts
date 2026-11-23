import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { solicitarOwner, solicitarRenter } from "../services/perfil.service.js";
import { AppError } from "../utils/response.util.js";

export const solicitarPerfilOwner = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;

    if (!userId) {
      return res.status(401).json({
        message: "No autorizado"
      });
    }

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

//nuevo endpoint para solicitar perfil de renter 23/11/26

export const solicitarPerfilRenter = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const nuevoRenter = await solicitarRenter(userId, req.body);

    return res.status(201).json({
      message: "Solicitud de perfil Renter creada correctamente",
      data: nuevoRenter
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Error interno del servidor" });
  }
  };