import {findOwnerByUserId, findRenterByUserId, crearOwner, crearRenter} from "../repositories/Perfil.repository.js";
import { AppError } from "../utils/response.util.js";
import type { DatosOwner, DatosRenter} from "../repositories/Perfil.repository.js";


export const solicitarOwner = async ( userId: string, datosOwner: DatosOwner) => {

    const existingOwner = await findOwnerByUserId(userId)

    if(existingOwner){
        throw new AppError(
        "Ya tienes un perfil de propietario registrado",
        409
    );
    }return await crearOwner(userId, datosOwner)
};

export const solicitarRenter = async (userId: string, datosRenter: DatosRenter) => {

    const existingRenter = await findRenterByUserId(userId);
    
      if (existingRenter) {
            throw new AppError("Ya tienes un perfil de arrendatario registrado", 409);
        }

    return await crearRenter(userId, datosRenter);

};