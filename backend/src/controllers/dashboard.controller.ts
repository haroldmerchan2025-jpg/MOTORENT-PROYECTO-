import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {calcularEstadisticasDashboard} from "../services/dashboard.service.js";
import { responseSuccess, responseError } from "../utils/response.util.js";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;
    if (!userId) {
      return responseError(res, "No autorizado", null, 401);
    }

        // el controlador llama al servicio
    const data = await calcularEstadisticasDashboard(userId);

        // entrega respuesta
    return responseSuccess(res, "Estadísticas obtenidas", data, 200);
    
    } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return responseError(res, mensaje, null, 500);
  }
};