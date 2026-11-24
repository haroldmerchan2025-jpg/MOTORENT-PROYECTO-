import type { ModoDashboard } from "./roles.utils";

export const EVENTO_CAMBIO_ROL = "motorent:cambio-rol";

const CLAVE_MODO_ACTIVO = "motorent_modo_activo";
const CLAVE_PREVIEW_DEV = "motorent_rol_preview_dev";

export type SimuladorRolDev = "REAL" | "USER" | "RENTER" | "OWNER" | "DUAL" | "ADMIN";

export function notificarCambioRol(): void {
  window.dispatchEvent(new Event(EVENTO_CAMBIO_ROL));
}

export function leerModoActivo(): ModoDashboard | null {
  const valor = sessionStorage.getItem(CLAVE_MODO_ACTIVO);
  if (
    valor === "USER" ||
    valor === "RENTER" ||
    valor === "OWNER" ||
    valor === "ADMIN"
  ) {
    return valor;
  }
  return null;
}

export function guardarModoActivo(modo: ModoDashboard | null): void {
  if (modo) {
    sessionStorage.setItem(CLAVE_MODO_ACTIVO, modo);
  } else {
    sessionStorage.removeItem(CLAVE_MODO_ACTIVO);
  }
  notificarCambioRol();
}

export function leerPreviewDev(): SimuladorRolDev {
  if (!import.meta.env.DEV) return "REAL";
  const valor = sessionStorage.getItem(CLAVE_PREVIEW_DEV);
  if (
    valor === "USER" ||
    valor === "RENTER" ||
    valor === "OWNER" ||
    valor === "DUAL" ||
    valor === "ADMIN"
  ) {
    return valor;
  }
  return "REAL";
}

export function guardarPreviewDev(opcion: SimuladorRolDev): void {
  if (!import.meta.env.DEV) return;
  if (opcion === "REAL") {
    sessionStorage.removeItem(CLAVE_PREVIEW_DEV);
  } else {
    sessionStorage.setItem(CLAVE_PREVIEW_DEV, opcion);
  }
  notificarCambioRol();
}

export function limpiarEstadoRolTemporal(): void {
  sessionStorage.removeItem(CLAVE_MODO_ACTIVO);
  sessionStorage.removeItem(CLAVE_PREVIEW_DEV);
  notificarCambioRol();
}
