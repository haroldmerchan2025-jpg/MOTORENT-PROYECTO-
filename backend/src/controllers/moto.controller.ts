import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getMotos = async (_req: Request, res: Response) => {
  try {
    const motos = await prisma.moto.findMany();
    res.status(200).json(motos);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar las motocicletas" });
  }
};


export const createMoto = async (req: Request, res: Response) => {
  try {
    const { brand, model, year, licensePlate, dailyRate, displacement, color } = req.body;

    if (!brand || !year || !model || !licensePlate || dailyRate ! || !displacement || !color) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben estar presentes" });
    };


    const newMoto = await prisma.moto.create({
      data: {
        brand,
        model,
        year: Number(year),
        licensePlate,
        dailyRate: Number(dailyRate),
        displacement: Number(displacement),
        color,
      },
    });

    res.status(201).json(newMoto);
  } catch (error) {
    res.status(400).json({ error: "Error al registrar la motocicleta" });
  }
};