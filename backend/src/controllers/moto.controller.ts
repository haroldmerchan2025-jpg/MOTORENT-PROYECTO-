import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { obtenerTodasLasMotos, registrarMoto } from "../services/moto.service.js";
import { responseSuccess, responseError } from "../utils/response.util.js";

export const getMotos = async (_req: Request, res: Response) => {
  try {
    const motos = await obtenerTodasLasMotos();
    return responseSuccess(res, "Motos obtenidas correctamente", motos, 200);
  } catch (error) {
    return responseError(res, "Error al consultar las motocicletas", error, 500);
  }
};

export const createMoto = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;
    if (!userId) {
      return responseError(res, "No autenticado", null, 401);
    }

    // Delegamos toda la lógica de validación y base de datos al Servicio
    const newMoto = await registrarMoto(userId, req.body);

    return responseSuccess(res, "Motocicleta registrada con éxito", newMoto, 201);
  } catch (error) {
    console.error("Error al registrar moto:", error);
    
    // Devolvemos el mensaje del error que lanzó el servicio (ej. "Esta placa ya esta registrada")
    const mensajeError = error instanceof Error ? error.message : "Error desconocido";
    
    return responseError(res, mensajeError, null, 400);
  }
};