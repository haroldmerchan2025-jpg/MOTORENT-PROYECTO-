
import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware.js";
import { getUserProfile } from "../services/auth-me.service.js";
import { AppError } from "../utils/response.util.js";

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "No autorizado",
      });
    }

    const user = await getUserProfile(userId);

    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        ok: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Error al obtener perfil",
    });
  }
};
