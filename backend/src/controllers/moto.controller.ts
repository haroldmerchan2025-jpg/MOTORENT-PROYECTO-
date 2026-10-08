import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { obtenerTodasLasMotos, registrarMoto } from "../services/moto.service.js";

export const getMotos = async (_req: Request, res: Response) => {
  try {
    const motos = await obtenerTodasLasMotos();
    res.status(200).json(motos);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar las motocicletas" });
  }
};

export const createMoto = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;
    if (!userId) {
      return res.status(401).json({ ok: false, message: "No autenticado" });
    }

    // Delegamos toda la lógica de validación y base de datos al Servicio
    const newMoto = await registrarMoto(userId, req.body);

    return res.status(201).json(newMoto);
  } catch (error) {
    console.error("Error al registrar moto:", error);
    
    // Devolvemos el mensaje del error que lanzó el servicio (ej. "Esta placa ya esta registrada")
    return res.status(400).json({
      ok: false,
      error: "Error al registrar la motocicleta",
      details: error instanceof Error ? error.message : "Error desconocido",
      // Enviamos el mensaje en "message" para mantener compatibilidad con el frontend
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};