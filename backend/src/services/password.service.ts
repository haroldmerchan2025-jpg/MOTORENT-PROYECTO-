import * as passwordRepo from "../repositories/password.repository.js";

export const olvidoContraseña = async (email: string) => {
    return await passwordRepo.olvidoContraseña(email);
}