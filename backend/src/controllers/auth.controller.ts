import { type Request, type Response } from "express";
import {registerUser} from "../services/auth.service.js";
import { type AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { sendVerificationEmail } from "../services/email.service.js";

export const newUser = async (req: Request, res: Response) => {

    try {

        const userData = req.body;

        const newUser = await registerUser(userData)


        return res.status(201).json({
            ok: true,
            message: "Usuario creado",
            data: newUser
        });



//         const existingNumber = await prisma.user.findFirst({
//             where: {
//                 OR: [
//                     { phone: phone }
//                 ]
//             }
//         });

//         if (existingNumber) {
//             return res.status(409).json({
//                 ok: false,
//                 message: "Numero de telefono existente"
//             });
//         }

//         const passwordHash = await bcrypt.hash(password, 10);

//         // Generamos un token criptográfico seguro de 32 bytes y expiración de 24 horas
//         const verificationToken = crypto.randomBytes(32).toString("hex");
//         const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

//         const user = await prisma.user.create({
//             data: {
//                 username,
//                 email,
//                 password: passwordHash,
//                 fullName,
//                 phone,  
//                 emailVerificationToken: verificationToken,
//                 emailVerificationExpires: verificationExpires,
//                 isEmailVerified: false
//             }
//         });

//         // Enviamos el correo de verificación (o se imprime en la terminal en modo simulador)
//         await sendVerificationEmail(user.email, user.fullName, verificationToken);

//         const { password: ignorePassword, ...userWithoutPassword } = user;

//         const token = jwt.sign({
//             id:user.id,
//             role:user.role
//         },
        
//             process.env.JWT_SECRET!,
//         {
//             expiresIn:"1d"
//         }
//     )

//         res.status(201).json({
//             ok: true,
//             message: "Usuario creado",
//             data: { user: userWithoutPassword },
//             token: token
//         }
//     );



    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// export const loginUser = async (req: Request, res: Response) => {

//     try {

//     const {identifier, password} = req.body;

//         if(!identifier || !password){
//             return res.status(401).json({
//                     ok:false,
//                     message:"Falta usuario o contraseña"
//                 })
//         };

//     const findUser = await prisma.user.findFirst({
//         where:{
//             OR:[
//             {username:identifier},
//             {email:identifier}
//             ]
//         }
//     })

//     if(!findUser){
//         return res.status(401).json({
//             ok:false,
//             message:"Cuenta no encontrada"
//         })
//     };

//     const passwordMatch = await bcrypt.compare(password,findUser.password)

//     if(!passwordMatch){
//         return res.status(401).json({
//             ok:false,
//             message: "usuario o contraseña incorrectos"
//         })
//     };

//     const token = jwt.sign({
//         id: findUser.id,
//         role: findUser.role
//     },
//         process.env.JWT_SECRET!,
    
//     {
//         expiresIn:"1d"
//     })

//         // Quitar la contraseña antes de responder
//     const { password: _, ...userWithoutPassword } = findUser;

//         res.status(200).json({
//             ok:true,
//             message: "Inicio de sesion exitoso",
//             token: token,
//             user: userWithoutPassword
//         })

//     }catch(error){
//         console.error(error);
//         res.status(500).json({
//             ok:false,
//             message:"Error interno del servidor"
//         });

//     }
// };

// // Obtener los datos del usuario que tiene la sesión activa
// export const getMe = async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.usuario?.id;
//         if (!userId) {
//             return res.status(401).json({ ok: false, message: "No autorizado" });
//         }

//         const user = await prisma.user.findUnique({
//             where: { id: userId },
//             include: {
//                 client: true,
//                 owner: true
//             }
//         });

//         if (!user) {
//             return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
//         }

//         const { password: _, ...userWithoutPassword } = user;

//         res.status(200).json({
//             ok: true,
//             user: userWithoutPassword
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ ok: false, message: "Error al obtener perfil" });
//     }
// };