import {findOwnerByUserId, crearOwner} from "../repositories/Perfil.repository.js";
import { AppError } from "../utils/response.util.js";
import type { DatosOwner } from "../repositories/Perfil.repository.js";

export const solicitarOwner = async ( userId: string, datosOwner: DatosOwner) => {

    const existingOwner = await findOwnerByUserId(userId)

    if(existingOwner){
        throw new AppError(
        "Ya tienes un perfil de propietario registrado",
        409
    );
    }return await crearOwner(userId, datosOwner);
    





};