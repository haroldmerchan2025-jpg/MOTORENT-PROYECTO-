
import { type Request, type Response } from "express";
import { authenticateUser } from "../services/auth-login.service.js";
import { AppError } from "../utils/response.util.js";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const loginData = req.body;

    const result = await authenticateUser(loginData);

    return res.status(200).json({
      ok: true,
      message: "Inicio de sesión exitoso",
      data: result,
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
      message: "Error interno del servidor",
    });
  }
};
