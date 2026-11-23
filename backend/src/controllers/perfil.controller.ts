import type { Request, Response } from "express";
import { solicitarOwner } from "../services/Perfil.service.js";
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