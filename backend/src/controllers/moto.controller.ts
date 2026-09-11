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
};