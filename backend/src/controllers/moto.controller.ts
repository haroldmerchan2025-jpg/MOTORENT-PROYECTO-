import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { PrismaClientRustPanicError } from "@prisma/client/runtime/client";

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
    const { brand, model, year, licensePlate, dailyRate, displacement, color, KM } = req.body;

    if (!brand || !year || !model || !licensePlate || dailyRate ! || !displacement || !color || !KM) {
      return res.status(400).json({ error: "Todos los campos deben estar llenos" });
    };

    const año = Number(year)

    if(!Number.isInteger(año) || año <= 2005){
      return res.status(400).json({
        ok:false,
        message: "El año de la moto tiene que ser mayor a el 2005"
      })
    };



    const placa = /^[A-Z]{3}\d{2}[A-Z]{1}$/;

    if(!placa.test(String(licensePlate))){
      return res.status(400).json({
        ok: false,
        message: "Numero de placa invalido"
      });
    };

    const existingPlaca = await prisma.moto.findFirst({
      where :{
          licensePlate:licensePlate
      }
    });

    if(existingPlaca){
      return res.status(401).json({
        ok:false,
        message: "Esta placa ya esta registrada"
      });
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
        KM
      },
    });

    res.status(201).json(newMoto);
  } catch (error) {
    res.status(400).json(
      { error: "Error al registrar la motocicleta" });
  }
};