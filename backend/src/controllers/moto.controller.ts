import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getMotos = async (_req: Request, res: Response) => {
  try {
    const motos = await prisma.moto.findMany();
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

    const { brand, model, year, licensePlate, dailyRate, displacement, color, KM } = req.body;

    // Validación de campos vacíos (permite KM = 0)
    if (
      !brand || !year || !model || !licensePlate || !dailyRate || !displacement || !color ||
      KM === undefined ||
      KM === null ||
      KM === ""
    ) {
      return res.status(400).json({ ok: false, message: "Todos los campos deben estar llenos" });
    }

    const año = Number(year);
    if (!Number.isInteger(año) || año <= 2005) {
      return res.status(400).json({
        ok: false,
        message: "El año de la moto tiene que ser mayor a el 2005",
      });
    }

    const placaLimpia = String(licensePlate).trim().toUpperCase();
    const regexPlaca = /^[A-Z]{3}\d{2}[A-Z]{1}$/;
    if (!regexPlaca.test(placaLimpia)) {
      return res.status(400).json({
        ok: false,
        message: "Numero de placa invalido (debe ser formato ABC12D)",
      });
    }

    const existingPlaca = await prisma.moto.findFirst({
      where: {
        licensePlate: placaLimpia,
      },
    });

    if (existingPlaca) {
      return res.status(400).json({
        ok: false,
        message: "Esta placa ya esta registrada",
      });
    }

    const cc = Number(displacement);
    if (isNaN(cc) || cc < 100 || cc > 1500) {
      return res.status(400).json({
        ok: false,
        message: "El cilindraje de la moto debe ser mayor o igual a 100 y menor o igual a 1500",
      });
    }

    const kmNumero = Number(KM);
    if (isNaN(kmNumero) || kmNumero < 0) {
      return res.status(400).json({
        ok: false,
        message: "El kilometraje debe ser un número mayor o igual a 0",
      });
    }

    // Buscar o crear el perfil de Owner para este usuario
    let owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (!owner) {
      owner = await prisma.owner.create({
        data: {
          userId,
          bankName: "Pendiente",
          accountType: "Pendiente",
          accountNumber: "Pendiente"
        }
      });
    }

    const newMoto = await prisma.moto.create({
      data: {
        brand: String(brand).trim(),
        model: String(model).trim(),
        year: año,
        licensePlate: placaLimpia,
        dailyRate: Number(dailyRate),
        displacement: String(displacement).trim(),
        color: String(color).trim(),
        KM: Math.round(kmNumero),
        ownerId: owner.id, // VINCULAR LA MOTO AL USUARIO
      },
    });

    return res.status(201).json(newMoto);
  } catch (error) {
    console.error("Error al registrar moto en PostgreSQL:", error);
    return res.status(400).json({
      ok: false,
      error: "Error al registrar la motocicleta",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};