import {Request, Response} from 'express';
import prisma from '../config/db';

export const obtenerMotos = async (req: Request, res: Response)=> {
    try{
        const motos = await prisma.moto.findMany();
        res.status(200).json({ok: true, data:motos});
    } catch (error){
        res.status(500).json({ok: false, mensaje: 'Error al obtener la lista de motos'});
    }
};

export const crearMoto = async (req: Request, res: Response) =>{
    try {
        const{marca,modelo,placa, disponible} =req.body;

        if(!marca || !modelo || !placa){
            return res.status(400).json ({ok: false, mensaje: 'Todos los campos son obligatorios'})
        }

    const nuevaMoto = await prime.moto.create({
        data: {
            marca,
            modelo,
            placa,
            disponible: disponible?? true
        }
    });

    res.status(201).json({
        ok:true,
        mensaje: 'Moto registrada con exito',
        data: nuevaMoto
      });
    }catch (error){
        res.status(500).json({ ok: false, mensaje:'Error al registrar la moto en el sistema'})
    }
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