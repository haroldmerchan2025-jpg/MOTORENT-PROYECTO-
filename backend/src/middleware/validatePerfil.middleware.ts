import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';

import {
  findOwnerByUserId,
  findRenterByUserId
} from '../repositories/Perfil.repository.js';

type Perfil = 'OWNER' | 'RENTER';

export const verificarPerfil = (perfil: Perfil) => {

  return async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
      const userId = req.usuario?.id;

      if (!userId) {
        return res.status(401).json({
          message: 'No autorizado'
        });
      }

      let perfilUsuario;

      if (perfil === 'OWNER') {
        perfilUsuario = await findOwnerByUserId(userId);
      } else {
        perfilUsuario = await findRenterByUserId(userId);
      }

      if (!perfilUsuario) {
        return res.status(403).json({
          message: 'No tienes este perfil registrado'
        });
      }

      if (perfilUsuario.estadoVerificacion !== 'APPROVED') {
        return res.status(403).json({
          message: 'Tu perfil todavía no está aprobado'
        });
      }

      next();

    } catch (error) {
      next(error);
    }
  };
};