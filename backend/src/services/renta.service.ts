import crypto from "node:crypto";
import * as repo from "../repositories/renta.repository.js";
import { buscarClientePorUserId } from "../repositories/documento.repository.js";
import { motoCumpleDocumentos } from "./documento.service.js";
import { encryptFile, sha256 } from "../utils/crypto.util.js";
import { parseDataUrl } from "../utils/file.util.js";
import { AppError } from "../utils/handler.util.js";

type Requester = { id: string; role: string };

const COMISION_PLATAFORMA = 0.15; // 15% MotoRent / 85% dueño
const DIA_MS = 24 * 60 * 60 * 1000;

const MAPA_INCIDENTE = {
  THEFT: "STOLEN",
  ACCIDENT: "ACCIDENTED",
  DISAPPEARANCE: "MISSING",
} as const;

const obtenerRentaDelCliente = async (userId: string, rentalId: string) => {
  const renta = await repo.buscarRentaConRelaciones(rentalId);
  if (!renta) throw new AppError("Renta no encontrada", 404);
  if (renta.renter.idUser !== userId) throw new AppError("Esta renta no es tuya", 403);
  return renta;
};

export const listarClausulas = async () => repo.listarClausulasActivas();

export const crearRenta = async (userId: string, body: any) => {
  const { motoId, startDate, endDate } = body ?? {};
  if (!motoId || !startDate || !endDate) {
    throw new Error("motoId, startDate y endDate son obligatorios");
  }

  const inicio = new Date(startDate);
  const fin = new Date(endDate);
  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) throw new Error("Fechas inválidas");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (inicio < hoy) throw new Error("La fecha de inicio no puede ser pasada");
  if (fin <= inicio) throw new Error("La fecha de fin debe ser posterior a la de inicio");

  const cliente = await buscarClientePorUserId(userId);
  if (!cliente) {
    throw new AppError("Primero debes registrar tu documento y licencia", 403);
  }
  if (cliente.licenseExpirationDate && cliente.licenseExpirationDate <= fin) {
    throw new Error("Tu licencia vence antes de que termine el alquiler");
  }

  const moto = await repo.buscarMoto(String(motoId));
  if (!moto) throw new AppError("Moto no encontrada", 404);
  if (moto.status !== "AVAILABLE") throw new Error("La moto no está disponible");

  const docs = await motoCumpleDocumentos(moto.id);
  if (!docs.ok) {
    throw new Error(`La moto no tiene documentos vigentes: ${docs.faltantes.join(", ")}`);
  }

  if (await repo.hayRentasSolapadas(moto.id, inicio, fin)) {
    throw new Error("La moto ya está reservada en esas fechas");
  }

  const dias = Math.ceil((fin.getTime() - inicio.getTime()) / DIA_MS);
  const subtotal = Math.round(dias * Number(moto.dailyRate));
  const platformFee = Math.round(subtotal * COMISION_PLATAFORMA);

  return repo.crearRenta({
    renterId: cliente.id,
    motoId: moto.id,
    startDate: inicio,
    endDate: fin,
    subtotal,
    platformFee,
    ownerEarnings: subtotal - platformFee,
    total: subtotal,
  });
};

export const firmarContrato = async (userId: string, rentalId: string, body: any, ip?: string) => {
  const renta = await obtenerRentaDelCliente(userId, rentalId);
  if (renta.status !== "PENDING") throw new Error("Solo se puede firmar una renta pendiente");
  if (renta.contract) throw new Error("Esta renta ya tiene contrato firmado");
  if (body?.accepted !== true) throw new Error("Debes aceptar las cláusulas del contrato");

  const firma = parseDataUrl(body?.signature, { allowed: ["image/png"], maxBytes: 500 * 1024 });

  const clausulas = await repo.listarClausulasActivas();
  if (clausulas.length === 0) throw new Error("No hay cláusulas configuradas en el sistema");

  const firmadoEn = new Date();
  const documentHash = sha256(
    JSON.stringify({
      rentalId,
      renterId: renta.renterId,
      motoId: renta.motoId,
      startDate: renta.startDate,
      endDate: renta.endDate,
      total: String(renta.total),
      clausulas: clausulas.map((c: { id: string; version: number; body: string }) => ({
        id: c.id,
        version: c.version,
        body: c.body,
      })),
      firmaSha256: sha256(firma.buffer),
      firmadoEn: firmadoEn.toISOString(),
    })
  );

  const contractNumber = `MR-${firmadoEn.getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  return repo.crearContratoFirmado(
    {
      rentalId,
      contractNumber,
      accepted: true,
      acceptedAt: firmadoEn,
      signatureEnc: encryptFile(firma),
      signedAt: firmadoEn,
      signedIp: ip ?? null,
      documentHash,
    },
    clausulas.map((c: { id: string; version: number; body: string }) => ({
      rentalId,
      clauseId: c.id,
      clauseVersion: c.version,
      bodySnapshot: c.body,
    }))
  );
};

export const reportarIncidente = async (requester: Requester, rentalId: string, body: any) => {
  const renta = await repo.buscarRentaConRelaciones(rentalId);
  if (!renta) throw new AppError("Renta no encontrada", 404);

  const esCliente = renta.renter.idUser === requester.id;
  const esDueno = renta.moto.owner?.idUser === requester.id;
  if (!esCliente && !esDueno && requester.role !== "ADMIN") {
    throw new AppError("No tienes permiso sobre esta renta", 403);
  }

  if (renta.status !== "ACTIVE") {
    throw new Error("Solo se puede reportar un incidente en una renta activa");
  }

  const tipoRaw = String(body?.type ?? "").toUpperCase();
  if (!(tipoRaw in MAPA_INCIDENTE)) {
    throw new Error(`Tipo inválido. Usa: ${Object.keys(MAPA_INCIDENTE).join(", ")}`);
  }
  const tipo = tipoRaw as keyof typeof MAPA_INCIDENTE;
  const notas = String(body?.notes ?? "").trim() || null;

  return repo.registrarIncidente(rentalId, renta.moto.id, tipo, notas, MAPA_INCIDENTE[tipo]);
};
