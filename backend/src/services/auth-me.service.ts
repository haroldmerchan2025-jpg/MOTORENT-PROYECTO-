
import { findUserById } from "../repositories/auth.repository.js";
import { AppError } from "../utils/response.util.js";

export const getUserProfile = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
