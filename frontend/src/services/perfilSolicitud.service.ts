/**
 * SERVICIO DE ENVÍO DE SOLICITUDES DE PERFIL (OWNER Y RENTER)
 *
 * Centraliza la conexión con el backend usando `fetch()` nativo y la variable
 * `VITE_API_URL`, siguiendo exactamente el mismo patrón del resto del proyecto.
 *
 * Si más adelante el equipo cambia alguna URL o nombre de campo en el backend,
 * solo hay que actualizar este archivo sin tocar los formularios visuales.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Límite de 2 MB por archivo para evitar superar el límite global de 15 MB en JSON
const MAX_BYTES_ARCHIVO = 2 * 1024 * 1024;
const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"];
const TIPOS_CON_PDF = [...TIPOS_IMAGEN, "application/pdf"];

export interface RespuestaSolicitud {
  ok: boolean;
  mensaje: string;
}

export interface DatosSolicitudOwner {
  cedulaNumero: string;
  cedulaFront: File;
  cedulaBack: File;
  photo: File;
  bill: File;
}

export interface DatosSolicitudRenter {
  cedulaNumero: string;
  cedulaFront: File;
  cedulaBack: File;
  photo: File;
  licenseNumber: string;
  licenseCategory: "A1" | "A2";
  licenseExpirationDate: string;
  licenseFront: File;
  licenseBack: File;
  bill: File;
}

/** Valida que el archivo elegido tenga formato permitido y no supere 2 MB. */
export function validarArchivoBasico(
  archivo: File,
  permitirPdf = false
): string | null {
  const permitidos = permitirPdf ? TIPOS_CON_PDF : TIPOS_IMAGEN;
  if (!permitidos.includes(archivo.type)) {
    return permitirPdf
      ? "Formato no válido. Usa PNG, JPG, WEBP o PDF."
      : "Formato no válido. Usa PNG, JPG o WEBP.";
  }
  if (archivo.size > MAX_BYTES_ARCHIVO) {
    return "El archivo supera los 2 MB permitidos. Elige una imagen más liviana.";
  }
  return null;
}

/** Convierte un archivo (imagen o PDF) en texto Base64 (DataURL) para enviarlo en JSON. */
export function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result ?? ""));
    lector.onerror = () => reject(new Error("No se pudo leer el archivo seleccionado."));
    lector.readAsDataURL(archivo);
  });
}

/** Lee el token JWT guardado al iniciar sesión. */
function obtenerTokenSesion(): string | null {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
}

/**
 * Envía la solicitud de perfil PROPIETARIO al endpoint real del equipo:
 * POST /create/perfil/owner (PR #44)
 */
export async function enviarSolicitudOwner(
  datos: DatosSolicitudOwner
): Promise<RespuestaSolicitud> {
  const token = obtenerTokenSesion();
  if (!token) {
    return {
      ok: false,
      mensaje: "Debes iniciar sesión antes de enviar tu solicitud.",
    };
  }

  try {
    // Convertimos los 4 archivos en paralelo a Base64
    const [cedulaFrontUrl, cedulaBackUrl, photo, billUrl] = await Promise.all([
      archivoABase64(datos.cedulaFront),
      archivoABase64(datos.cedulaBack),
      archivoABase64(datos.photo),
      archivoABase64(datos.bill),
    ]);

    const respuesta = await fetch(`${API_URL}/create/perfil/owner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cedulaNumero: datos.cedulaNumero.trim(),
        cedulaFrontUrl,
        cedulaBackUrl,
        photo,
        billUrl,
      }),
    });

    const json = (await respuesta.json()) as {
      message?: string;
      mensaje?: string;
    };

    if (!respuesta.ok) {
      return {
        ok: false,
        mensaje:
          json.message ||
          json.mensaje ||
          "No se pudo registrar la solicitud de propietario.",
      };
    }

    return {
      ok: true,
      mensaje:
        json.message ||
        json.mensaje ||
        "Solicitud de perfil propietario enviada correctamente.",
    };
  } catch {
    return {
      ok: false,
      mensaje: "No fue posible conectar con el servidor. Verifica que el backend esté encendido.",
    };
  }
}

/**
 * Envía la solicitud de perfil ARRENDATARIO al endpoint oficial del equipo:
 * POST /create/perfil/renter (PR #45)
 */
export async function enviarSolicitudRenter(
  datos: DatosSolicitudRenter
): Promise<RespuestaSolicitud> {
  const token = obtenerTokenSesion();
  if (!token) {
    return {
      ok: false,
      mensaje: "Debes iniciar sesión antes de enviar tu solicitud.",
    };
  }

  try {
    // Convertimos los 6 documentos obligatorios de Renter en paralelo a Base64
    const [cedulaFrontUrl, cedulaBackUrl, licenseFrontUrl, licenseBackUrl, photo, billUrl] =
      await Promise.all([
        archivoABase64(datos.cedulaFront),
        archivoABase64(datos.cedulaBack),
        archivoABase64(datos.licenseFront),
        archivoABase64(datos.licenseBack),
        archivoABase64(datos.photo),
        archivoABase64(datos.bill),
      ]);

    const respuesta = await fetch(`${API_URL}/create/perfil/renter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cedulaNumero: datos.cedulaNumero.trim(),
        cedulaFrontUrl,
        cedulaBackUrl,
        photo,
        licenseNumber: datos.licenseNumber.trim(),
        licenseFrontUrl,
        licenseBackUrl,
        licenseCategory: datos.licenseCategory,
        licenseExpirationDate: new Date(datos.licenseExpirationDate).toISOString(),
        billUrl,
      }),
    });

    const json = (await respuesta.json()) as {
      message?: string;
      mensaje?: string;
    };

    if (!respuesta.ok) {
      return {
        ok: false,
        mensaje:
          json.message ||
          json.mensaje ||
          "No se pudo registrar la solicitud de arrendatario.",
      };
    }

    return {
      ok: true,
      mensaje:
        json.message ||
        json.mensaje ||
        "Solicitud de perfil arrendatario enviada correctamente.",
    };
  } catch {
    return {
      ok: false,
      mensaje: "No fue posible conectar con el servidor. Verifica que el backend esté encendido.",
    };
  }
}
