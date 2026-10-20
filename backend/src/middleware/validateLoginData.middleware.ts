
import { type Request, type Response, type NextFunction } from "express";

export const validateLoginData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { identifier, password } = req.body;

  if (
    typeof identifier !== "string" ||
    !identifier.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      ok: false,
      message: "Debe proporcionar un usuario o correo y una contraseña válidos",
    });
  }

  next();
};
