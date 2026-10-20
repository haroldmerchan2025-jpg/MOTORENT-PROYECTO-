import type { Request, Response } from "express";
import {
  verificarCorreoConToken,
  reenviarCorreoVerificacion,
} from "../services/verification.service.js";
import { responseSuccess, responseError } from "../utils/response.util.js";

// ----------------------------------------------------------------------
// 1. VERIFICAR CORREO ELECTRÓNICO (GET /auth/verify-email/:token)
// ----------------------------------------------------------------------
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const resultado = await verificarCorreoConToken(String(token));
    return responseSuccess(res, resultado.mensaje, null, 200);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return responseError(res, mensaje, null, 400);
  }
};

// ----------------------------------------------------------------------
// 2. REENVIAR CORREO DE VERIFICACIÓN (POST /auth/resend-verification)
// ----------------------------------------------------------------------
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const resultado = await reenviarCorreoVerificacion(email);
    return responseSuccess(res, resultado.mensaje, null, 200);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return responseError(res, mensaje, null, 400);
  }
};