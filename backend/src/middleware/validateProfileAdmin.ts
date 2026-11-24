import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';


export const verificarAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.usuario || req.usuario.role !== "ADMIN") {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permisos de administrador"
    });
  }

  next();
};