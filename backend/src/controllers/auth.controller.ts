import { type Request, type Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res:Response) =>{

    try{

    const {username, email, password, fullName, phone} = req.body

        if(!username || !email || !password || !fullName || !phone){
            return (
                res.status(400).json({
                ok: false,
                message: "Es obligatorio que llene todos los datos"
                })
            );

        };

        if(!email.includes("@")){
            return(
                res.status(400).json({
                    ok: false,
                    message: "El correo debe ser valido"
                })
            );
        };

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#$%&@]).{8,16}$/

        if(!passwordRegex.test(password))
                        return(
                res.status(400).json({
                    ok: false,
                    message: "Contraseña no cumple los parametros"
                })
            );

        const existingUser = await prisma.user.findFirst({
            where: {
                OR:[
                    {username:username},
                    {email:email}
                ]
            }
        });
        
        if(existingUser){
            return(
                res.status(409).json({
                    ok: false,
                    message: "Nombre de usuario o correo existentes"
                        })
                    )};

        const passwordHash = await bcrypt.hash(password,10)

        const user = await prisma.user.create({
            data:{
            username, 
            email, 
            password: passwordHash, 
            fullName, 
            phone}
        })
        const {password: ignorePassword, ...userWithoutPassword} = user;

        res.status(201).json({
            ok:true,
            message: "Usuario creado",
            data:{user:userWithoutPassword}
        })

    }catch(error){
    console.error(error);

        res.status(500).json({
            ok:false,
            message: "Error interno del servidor"
        })
    }
};

export const loginUser = async (req: Request, res: Response) => {

    const {identifier, password} = req.body;

        if(!identifier || !password){
            return res.status(401).json({
                    ok:false,
                    message:"Falta usuario o contraseña"
                })
        };

    const findUser = await prisma.user.findFirst({
        where:{
            OR:[
            {username:identifier},
            {email:identifier}
            ]
        }
    })

    if(!findUser){
        return res.status(401).json({
            ok:false,
            message:"Cuenta no encontrada"
        })
    };

    const passwordMatch = await bcrypt.compare(password,findUser.password)

    if(!passwordMatch){
        return res.status(401).json({
            ok:false,
            message: "usuario o contraseña incorrectos"
        })
    };

    const token = jwt.sign({
        id: findUser.id,
        role: findUser.role
    },
        process.env.JWT_SECRET!,
    
    {
        expiresIn:"1d"
    })


        res.status(200).json({
            ok:true,
            message: "Inicio de sesion exitoso",
            token: token
        })
};
