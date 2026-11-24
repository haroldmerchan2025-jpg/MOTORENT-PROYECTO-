/**
 * Servicio encargado de cargar la información del Dashboard:
 * 1. Perfil actualizado del usuario (GET /auth/me) para leer su rol y
 *    estados de verificación reales desde PostgreSQL.
 * 2. Estadísticas y renta activa (GET /dashboard).
 *
 * Usa Promise.allSettled para que, si uno de los dos endpoints falla
 * temporalmente, la pantalla siga funcionando con la información disponible.
 */

import type { UsuarioSesion } from "../utils/roles.utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface EstadisticasDashboard {
  rentasComoCliente: number;
  motosPublicadas: number;
  gananciasDelMes: number;
  proximaDevolucion: string;
}

export interface RentaActiva {
  moto: string;
  fechaDevolucion: string;
  diasRestantes: number;
  tarifaDiaria: number;
}

export interface ResultadoCargaDashboard {
  usuario: UsuarioSesion | null;
  estadisticas: EstadisticasDashboard;
  rentaActiva: RentaActiva | null;
  sesionExpirada: boolean;
  advertenciaApi: string | null;
}

export const ESTADISTICAS_INICIALES: EstadisticasDashboard = {
  rentasComoCliente: 0,
  motosPublicadas: 0,
  gananciasDelMes: 0,
  proximaDevolucion: "--",
};

/** Lee de forma segura el usuario guardado en localStorage como respaldo inicial. */
export function leerUsuarioLocal(): UsuarioSesion | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") {
      return null;
    }
    return JSON.parse(raw) as UsuarioSesion;
  } catch {
    return null;
  }
}

/** Carga perfil actualizado + estadísticas del Dashboard desde el backend. */
export async function cargarDatosDashboard(): Promise<ResultadoCargaDashboard> {
  const token = localStorage.getItem("token");
  const usuarioRespaldo = leerUsuarioLocal();

  if (!token || token === "undefined" || token === "null") {
    return {
      usuario: null,
      estadisticas: ESTADISTICAS_INICIALES,
      rentaActiva: null,
      sesionExpirada: true,
      advertenciaApi: null,
    };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Ejecutamos ambas peticiones en paralelo para mejorar el tiempo de carga
  const [resMe, resStats] = await Promise.allSettled([
    fetch(`${API_URL}/auth/me`, { headers }),
    fetch(`${API_URL}/dashboard`, { headers }),
  ]);

  let usuario: UsuarioSesion | null = usuarioRespaldo;
  let estadisticas: EstadisticasDashboard = ESTADISTICAS_INICIALES;
  let rentaActiva: RentaActiva | null = null;
  let sesionExpirada = false;
  let advertenciaApi: string | null = null;

  // 1. Procesar respuesta de /auth/me
  if (resMe.status === "fulfilled") {
    const response = resMe.value;
    if (response.status === 401 || response.status === 403) {
      sesionExpirada = true;
    } else if (response.ok) {
      const data = await response.json().catch(() => null);
      const userRecibido = data?.user || data?.data?.user || null;
      if (userRecibido) {
        usuario = userRecibido;
        localStorage.setItem("user", JSON.stringify(userRecibido));
      }
    }
  } else {
    advertenciaApi =
      "No fue posible sincronizar tu perfil con el servidor. Mostrando datos locales.";
  }

  // 2. Procesar respuesta de /dashboard
  if (resStats.status === "fulfilled") {
    const response = resStats.value;
    if (response.status === 401 || response.status === 403) {
      sesionExpirada = true;
    } else if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data && (data.ok || data.status === "success")) {
        const payload = data.data || data;
        if (payload.estadisticas) {
          estadisticas = payload.estadisticas;
        }
        if (payload.rentaActiva) {
          rentaActiva = payload.rentaActiva;
        }
      }
    } else if (!advertenciaApi) {
      advertenciaApi =
        "Algunas métricas del panel no pudieron cargarse desde el servidor.";
    }
  } else if (!advertenciaApi) {
    advertenciaApi =
      "No se pudo conectar con el servidor para cargar tus estadísticas.";
  }

  return {
    usuario,
    estadisticas,
    rentaActiva,
    sesionExpirada,
    advertenciaApi,
  };
}
