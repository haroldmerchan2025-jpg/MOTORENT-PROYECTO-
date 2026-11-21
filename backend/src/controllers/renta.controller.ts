import * as service from "../services/renta.service.js";
import { responseSuccess } from "../utils/response.util.js";
import { ejecutar, exigirUsuario } from "../utils/handler.util.js";

export const listarClausulas = ejecutar(async (_req, res) => {
  const data = await service.listarClausulas();
  return responseSuccess(res, "Cláusulas vigentes", data, 200);
});

export const crearRenta = ejecutar(async (req, res) => {
  const u = exigirUsuario(req);
  const data = await service.crearRenta(u.id, req.body);
  return responseSuccess(res, "Renta creada", data, 201);
});

export const firmarContrato = ejecutar(async (req, res) => {
  const u = exigirUsuario(req);
  const data = await service.firmarContrato(u.id, String(req.params.id), req.body, req.ip);
  return responseSuccess(res, "Contrato firmado", data, 201);
});

export const reportarIncidente = ejecutar(async (req, res) => {
  const u = exigirUsuario(req);
  const data = await service.reportarIncidente(u, String(req.params.id), req.body);
  return responseSuccess(res, "Incidente reportado", data, 200);
});
