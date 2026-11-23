import * as repo from "../repositories/documento.repository.js";
import { encryptFile, decryptFile } from "../utils/crypto.util.js";
import { parseDataUrl } from "../utils/file.util.js";
import { AppError } from "../utils/handler.util.js";

type Requester = { id: string; role: string };

const CAMPOS_CLIENTE = {
  "documento-frente": "documentFrontEnc",
  "documento-reverso": "documentBackEnc",
  "licencia-frente": "licenseFrontEnc",
  "licencia-reverso": "licenseBackEnc",
} as const;
type CampoCliente = keyof typeof CAMPOS_CLIENTE;

const TIPOS_LEGALES = ["TRANSIT_LICENSE", "SOAT", "TECHNICAL_REVIEW", "INSURANCE"] as const;
type TipoLegal = (typeof TIPOS_LEGALES)[number];
const REQUIEREN_VIGENCIA: TipoLegal[] = ["SOAT", "TECHNICAL_REVIEW", "INSURANCE"];
const OBLIGATORIOS: TipoLegal[] = ["TRANSIT_LICENSE", "SOAT", "TECHNICAL_REVIEW"];

// ===================== CLIENTE / RENTER ===================== //

export const guardarDocumentosCliente = async (userId: string, body: any) => {
  const {
    documentNumber, cedulaNumero, licenseNumber, licenseCategory, licenseExpirationDate,
    documentFront, documentBack, licenseFront, licenseBack, photo, bill, billUrl,
  } = body ?? {};

  const numDoc = documentNumber || cedulaNumero;
  const reciboDomicilio = billUrl || bill;

  if (!numDoc || !licenseNumber || !licenseCategory || !licenseExpirationDate) {
    throw new Error("Faltan datos del documento o de la licencia");
  }

  if (!photo || !reciboDomicilio) {
    throw new Error("La fotografía personal y el comprobante de domicilio son obligatorios");
  }

  const vence = new Date(licenseExpirationDate);
  if (isNaN(vence.getTime()) || vence <= new Date()) {
    throw new Error("La licencia de conducción está vencida o la fecha es inválida");
  }

  // Validamos formato y peso de foto personal (imagen) y comprobante de domicilio (imagen o PDF)
  parseDataUrl(photo, { allowed: ["image/jpeg", "image/png", "image/webp"] });
  parseDataUrl(reciboDomicilio, {
    allowed: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  });

  return repo.upsertCliente(userId, {
    cedulaNumero: String(numDoc).trim(),
    licenseNumber: String(licenseNumber).trim(),
    licenseCategory: String(licenseCategory).trim().toUpperCase(),
    licenseExpirationDate: vence,
    photo: String(photo),
    billUrl: String(reciboDomicilio),
    documentFrontEnc: encryptFile(parseDataUrl(documentFront)),
    documentBackEnc: encryptFile(parseDataUrl(documentBack)),
    licenseFrontEnc: encryptFile(parseDataUrl(licenseFront)),
    licenseBackEnc: encryptFile(parseDataUrl(licenseBack)),
  });
};

export const obtenerArchivoCliente = async (requester: Requester, userIdParam: string, campo: string) => {
  const duenoId = userIdParam === "me" ? requester.id : userIdParam;
  if (duenoId !== requester.id && requester.role !== "ADMIN") {
    throw new AppError("No autorizado para ver este documento", 403);
  }

  const columna = CAMPOS_CLIENTE[campo as CampoCliente];
  if (!columna) throw new AppError(`Campo inválido. Usa: ${Object.keys(CAMPOS_CLIENTE).join(", ")}`, 400);

  const cliente = await repo.buscarClientePorUserId(duenoId);
  const blob = cliente?.[columna];
  if (!blob) throw new AppError("Archivo no encontrado", 404);

  return decryptFile(blob);
};

// ===================== MOTO: DOCUMENTOS ===================== //

const verificarAccesoMoto = async (requester: Requester, motoId: string) => {
  const moto = await repo.buscarMotoConDueno(motoId);
  if (!moto) throw new AppError("Moto no encontrada", 404);
  if (requester.role !== "ADMIN" && moto.owner?.idUser !== requester.id) {
    throw new AppError("No tienes permiso sobre esta moto", 403);
  }
  return moto;
};

const validarTipoLegal = (raw: string): TipoLegal => {
  const tipo = String(raw).toUpperCase() as TipoLegal;
  if (!TIPOS_LEGALES.includes(tipo)) {
    throw new AppError(`Tipo inválido. Usa: ${TIPOS_LEGALES.join(", ")}`, 400);
  }
  return tipo;
};

export const guardarDocumentoLegal = async (requester: Requester, motoId: string, tipoRaw: string, body: any) => {
  await verificarAccesoMoto(requester, motoId);
  const tipo = validarTipoLegal(tipoRaw);
  const { number, expiresAt, file } = body ?? {};

  let vence: Date | null = null;
  if (REQUIEREN_VIGENCIA.includes(tipo)) {
    vence = new Date(expiresAt);
    if (isNaN(vence.getTime()) || vence <= new Date()) {
      throw new Error("La fecha de vencimiento es inválida o el documento ya está vencido");
    }
  }

  return repo.upsertDocumentoLegal(motoId, tipo, {
    number: number ? String(number).trim() : null,
    expiresAt: vence,
    fileEnc: encryptFile(parseDataUrl(file)),
  });
};

export const obtenerDocumentoLegal = async (requester: Requester, motoId: string, tipoRaw: string) => {
  await verificarAccesoMoto(requester, motoId);
  const doc = await repo.buscarDocumentoLegal(motoId, validarTipoLegal(tipoRaw));
  if (!doc) throw new AppError("Documento no encontrado", 404);
  return decryptFile(doc.fileEnc);
};

export const motoCumpleDocumentos = async (motoId: string) => {
  const docs = await repo.listarDocumentosLegales(motoId);
  const ahora = new Date();

  const faltantes = OBLIGATORIOS.filter((tipo) => {
    const d = docs.find((x: { type: TipoLegal; expiresAt: Date | null }) => x.type === tipo);
    if (!d) return true;
    if (REQUIEREN_VIGENCIA.includes(tipo) && (!d.expiresAt || d.expiresAt <= ahora)) return true;
    return false;
  });

  return { ok: faltantes.length === 0, faltantes };
};

export const consultarDisponibilidad = async (motoId: string) => {
  const moto = await repo.buscarMotoConDueno(motoId);
  if (!moto) throw new AppError("Moto no encontrada", 404);
  const docs = await motoCumpleDocumentos(motoId);
  return {
    status: moto.status,
    documentosVigentes: docs.ok,
    documentosFaltantes: docs.faltantes,
    disponible: moto.status === "AVAILABLE" && docs.ok,
  };
};

// ===================== MOTO: IMÁGENES ===================== //

export const guardarImagenMoto = async (requester: Requester, motoId: string, body: any) => {
  await verificarAccesoMoto(requester, motoId);
  const { mime, buffer } = parseDataUrl(body?.image, {
    allowed: ["image/jpeg", "image/png", "image/webp"],
  });
  return repo.crearImagenMoto(motoId, { data: buffer, mime, isPrimary: body?.isPrimary === true });
};

export const listarImagenes = async (motoId: string) => repo.listarImagenesMoto(motoId);

export const obtenerImagen = async (imageId: string) => {
  const img = await repo.buscarImagen(imageId);
  if (!img) throw new AppError("Imagen no encontrada", 404);
  return { mime: img.mime, buffer: Buffer.from(img.data) };
};
