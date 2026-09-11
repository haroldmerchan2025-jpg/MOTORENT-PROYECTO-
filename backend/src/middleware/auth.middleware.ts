import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "Token_de motorent"

export interface AuthRequest extends Request {
    usuario?:{
        id: string;
        rol: string;
    };
};

export const verificartoken = (req: AuthRequest, res: Response, next: NextFunction )=>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split('')[1];

    if(!token){
        return res.status(401).json({
            ok:false,
            mensaje: 'Acceso denegado, no tiene token de sesion activo'
        });
    }
};

try {
    const decodificado = jwt.verify(token , JWT_SECRET) as {id: string, rol: string};

    req.usuario = decodificado;

    next()
} catch (error) {
    return res.status(403).json({
        ok: false,
        mensaje: 'Token invalido o expirado . por favor vuelve a iniciar sesion'
    });
};