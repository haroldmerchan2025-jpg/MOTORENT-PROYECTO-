import type { Request, Response } from "express";
// Se agrega la extensión .js a la importación relativa para cumplir la regla ECMAScript de TypeScript
import { prisma } from "../config/prisma.js";

// Obtener todas las motocicletas registradas
export const getMotos = async (_req: Request, res: Response) => {
  try {
    // Consulta en PostgreSQL equivalente a SELECT * FROM "Moto"
    const motos = await prisma.moto.findMany();
    res.json(motos);
  } catch (error) {
    // Retorna estado 500 en caso de fallo en la base de datos
    res.status(500).json({ error: "Error al consultar las motocicletas" });
  }
};

// Registrar una nueva motocicleta
export const createMoto = async (req: Request, res: Response) => {
  try {
    // Extraer los atributos enviados en el cuerpo de la petición JSON
    const { brand, model, year, licensePlate, dailyRate } = req.body;

    // Crear el nuevo registro dentro de la tabla Moto
    const newMoto = await prisma.moto.create({
      data: { brand, model, year, licensePlate, dailyRate },
    });

    // Retornar la moto creada con estado HTTP 201 (Creado)
    res.status(201).json(newMoto);
  } catch (error) {
    // Retorna estado 400 si faltan campos o si la placa ya existe
    res.status(400).json({ error: "Error al registrar la motocicleta" });
  }
};