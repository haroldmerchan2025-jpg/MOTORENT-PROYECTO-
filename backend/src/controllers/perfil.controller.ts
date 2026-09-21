import {type Request, type Response, } from "express";
import { prisma } from "../config/prisma.js";
import  {type AuthRequest} from "../middleware/auth.middleware.js"

export const verPerfil = async (req: AuthRequest, res: Response)=>{

    try {

    if(!req.usuario){
        return res.status(400).json({
            ok:false,
            message: "usuario no existe"
        })
    }

    const getUser = await prisma.user.findFirst({
        where: {
            id : req.usuario.id
        }
    });

    if(!getUser){
        return res.status(404).json({
            ok:false,
            message: "Usuario no encontrado"
        });
    };
    
}catch(error){
    console.error("Error interno del servidor")
}
};


export const actualizarPerfil = async (req: Request, res : Response)=> {

}