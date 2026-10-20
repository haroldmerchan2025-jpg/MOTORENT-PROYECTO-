import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByIdentifier } from "../repositories/auth.repository.js";
import { AppError } from "../utils/response.util.js";

type LoginData = {
  identifier: string;
  password: string;
};

export const authenticateUser = async (loginData: LoginData) => {
  const { identifier, password } = loginData;

  if (
    typeof identifier !== "string" ||
    !identifier.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    throw new AppError("Usuario o contraseña incorrectos", 401);
  }

  const user = await findUserByIdentifier(identifier.trim());

  if (!user) {
    throw new AppError("Usuario o contraseña incorrectos", 401);
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new AppError("Usuario o contraseña incorrectos", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("Error de configuración del servidor", 500);
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    }
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};