import * as motoRepository from "../repositories/moto.repository.js";

interface CrearMotoData {
  brand: string;
  model: string;
  year: number | string;
  licensePlate: string;
  dailyRate: number | string;
  displacement: number | string;
  color: string;
  KM: number | string;
}

export const obtenerTodasLasMotos = async () => {
  return await motoRepository.obtenerTodasLasMotos();
};

export const registrarMoto = async (userId: string, data: CrearMotoData) => {
  const { brand, model, year, licensePlate, dailyRate, displacement, color, KM } = data;

  // 1. Validaciones de Negocio
  if (
    !brand || !year || !model || !licensePlate || !dailyRate || !displacement || !color ||
    KM === undefined || KM === null || KM === ""
  ) {
    throw new Error("Todos los campos deben estar llenos");
  }

  const año = Number(year);
  if (!Number.isInteger(año) || año <= 2005) {
    throw new Error("El año de la moto tiene que ser mayor a el 2005");
  }

  const placaLimpia = String(licensePlate).trim().toUpperCase();
  const regexPlaca = /^[A-Z]{3}\d{2}[A-Z]{1}$/;
  if (!regexPlaca.test(placaLimpia)) {
    throw new Error("Numero de placa invalido (debe ser formato ABC12D)");
  }

  const cc = Number(displacement);
  if (isNaN(cc) || cc < 100 || cc > 1500) {
    throw new Error("El cilindraje de la moto debe ser mayor o igual a 100 y menor o igual a 1500");
  }

  const kmNumero = Number(KM);
  if (isNaN(kmNumero) || kmNumero < 0) {
    throw new Error("El kilometraje debe ser un número mayor o igual a 0");
  }

  // 2. Acceso a base de datos mediante el REPOSITORIO (El Chef llama al Bodeguero)
  const existingPlaca = await motoRepository.buscarMotoPorPlaca(placaLimpia);

  if (existingPlaca) {
    throw new Error("Esta placa ya esta registrada");
  }

  // Buscar o crear el perfil de Owner usando el repositorio
  let owner = await motoRepository.buscarOwnerPorUserId(userId);

  if (!owner) {
    owner = await motoRepository.crearOwnerPendiente(userId);
  }

  // 3. Crear el recurso
  const newMoto = await motoRepository.crearMoto({
    brand: String(brand).trim(),
    model: String(model).trim(),
    year: año,
    licensePlate: placaLimpia,
    dailyRate: Number(dailyRate),
    displacement: String(displacement).trim(),
    color: String(color).trim(),
    KM: Math.round(kmNumero),
    ownerId: owner.id,
  });

  return newMoto;
};
