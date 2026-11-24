export type RolBase = "USER" | "RENTER" | "OWNER" | "ADMIN";
export type EstadoPerfilUI = "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
export type ModoDashboard = "USER" | "RENTER" | "OWNER" | "ADMIN";

export interface PerfilVerificable {
  estadoVerificacion?: string | null;
  verificationStatus?: string | null;
  motivoRechazo?: string | null;
  verificationNotes?: string | null;
}

export interface UsuarioSesion {
  id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  isEmailVerified?: boolean;
  renter?: PerfilVerificable | null;
  client?: PerfilVerificable | null;
  owner?: PerfilVerificable | null;
}

export interface ResumenRolesUsuario {
  rolPrincipal: RolBase;
  esAdmin: boolean;
  estadoRenter: EstadoPerfilUI;
  estadoOwner: EstadoPerfilUI;
  motivoRechazoRenter: string | null;
  motivoRechazoOwner: string | null;
  puedeVerModoRenter: boolean;
  puedeVerModoOwner: boolean;
  esUsuarioDual: boolean;
  modoInicial: ModoDashboard;
  etiquetaRol: string;
}

export function normalizarRolBase(role?: string | null): RolBase {
  const rolLimpio = (role || "USER").toUpperCase();

  if (rolLimpio === "ADMIN") return "ADMIN";
  if (rolLimpio === "OWNER") return "OWNER";
  if (rolLimpio === "RENTER" || rolLimpio === "CLIENT") return "RENTER";

  return "USER";
}

export function normalizarEstadoVerificacion(
  estado?: string | null
): EstadoPerfilUI {
  const valor = (estado || "").toUpperCase();

  if (valor === "APPROVED" || valor === "VERIFIED") return "APPROVED";
  if (valor === "PENDING") return "PENDING";
  if (valor === "REJECTED") return "REJECTED";

  return "NOT_STARTED";
}

export function obtenerResumenRoles(
  usuario: UsuarioSesion | null,
  estadoLocalRenter: string | null = null,
  estadoLocalOwner: string | null = null
): ResumenRolesUsuario {
  const rolPrincipal = normalizarRolBase(usuario?.role);
  const esAdmin = rolPrincipal === "ADMIN";

  const perfilRenter = usuario?.renter ?? usuario?.client ?? null;
  const estadoRenterBackend = normalizarEstadoVerificacion(
    perfilRenter?.estadoVerificacion ?? perfilRenter?.verificationStatus
  );

  let estadoRenter: EstadoPerfilUI = estadoRenterBackend;
  if (estadoRenter === "NOT_STARTED" && rolPrincipal === "RENTER") {
    estadoRenter = "APPROVED";
  } else if (estadoRenter === "NOT_STARTED" && estadoLocalRenter) {
    estadoRenter = normalizarEstadoVerificacion(estadoLocalRenter);
  }

  const perfilOwner = usuario?.owner ?? null;
  const estadoOwnerBackend = normalizarEstadoVerificacion(
    perfilOwner?.estadoVerificacion ?? perfilOwner?.verificationStatus
  );

  let estadoOwner: EstadoPerfilUI = estadoOwnerBackend;
  if (estadoOwner === "NOT_STARTED" && rolPrincipal === "OWNER") {
    estadoOwner = "APPROVED";
  } else if (estadoOwner === "NOT_STARTED" && estadoLocalOwner) {
    estadoOwner = normalizarEstadoVerificacion(estadoLocalOwner);
  }

  const motivoRechazoRenter =
    perfilRenter?.motivoRechazo ?? perfilRenter?.verificationNotes ?? null;
  const motivoRechazoOwner =
    perfilOwner?.motivoRechazo ?? perfilOwner?.verificationNotes ?? null;

  const puedeVerModoRenter = estadoRenter === "APPROVED" || rolPrincipal === "RENTER";
  const puedeVerModoOwner = estadoOwner === "APPROVED" || rolPrincipal === "OWNER";
  const esUsuarioDual = !esAdmin && puedeVerModoRenter && puedeVerModoOwner;

  let modoInicial: ModoDashboard = "USER";
  let etiquetaRol = "Usuario registrado";

  if (esAdmin) {
    modoInicial = "ADMIN";
    etiquetaRol = "Administrador";
  } else if (esUsuarioDual) {
    modoInicial = "RENTER";
    etiquetaRol = "Arrendatario y Propietario";
  } else if (puedeVerModoOwner) {
    modoInicial = "OWNER";
    etiquetaRol = "Propietario verificado";
  } else if (puedeVerModoRenter) {
    modoInicial = "RENTER";
    etiquetaRol = "Arrendatario verificado";
  }

  return {
    rolPrincipal,
    esAdmin,
    estadoRenter,
    estadoOwner,
    motivoRechazoRenter,
    motivoRechazoOwner,
    puedeVerModoRenter,
    puedeVerModoOwner,
    esUsuarioDual,
    modoInicial,
    etiquetaRol,
  };
}

export function obtenerInfoBadgeEstado(estado: EstadoPerfilUI): {
  texto: string;
  variante: "neutral" | "pending" | "approved" | "rejected";
} {
  switch (estado) {
    case "APPROVED":
      return { texto: "Verificado", variante: "approved" };
    case "PENDING":
      return { texto: "En revisión", variante: "pending" };
    case "REJECTED":
      return { texto: "Requiere corrección", variante: "rejected" };
    default:
      return { texto: "Sin verificar", variante: "neutral" };
  }
}

export interface EnlaceNavegacion {
  label: string;
  to: string;
  destacado?: boolean;
}

export interface ConfiguracionNavbar {
  enlacesPrincipales: EnlaceNavegacion[];
  enlacesMenuPerfil: EnlaceNavegacion[];
  etiquetaRolNav: string | null;
  varianteRolNav: "user" | "renter" | "owner" | "admin" | null;
}

export function obtenerNavegacionPorRol(
  haySesion: boolean,
  resumen: ResumenRolesUsuario | null,
  modoActivo?: ModoDashboard | null
): ConfiguracionNavbar {
  if (!haySesion || !resumen) {
    return {
      enlacesPrincipales: [
        { label: "Inicio", to: "/" },
        { label: "Catálogo", to: "/motos" },
      ],
      enlacesMenuPerfil: [],
      etiquetaRolNav: null,
      varianteRolNav: null,
    };
  }

  const modo: ModoDashboard = modoActivo || resumen.modoInicial;

  if (modo === "ADMIN") {
    return {
      enlacesPrincipales: [
        { label: "Panel Administrativo", to: "/dashboard" },
        { label: "Catálogo", to: "/motos" },
      ],
      enlacesMenuPerfil: [{ label: "Mi Perfil", to: "/perfil" }],
      etiquetaRolNav: "Administrador",
      varianteRolNav: "admin",
    };
  }

  if (modo === "OWNER") {
    const enlacesPerfil: EnlaceNavegacion[] = [
      { label: "Mi Perfil y Verificaciones", to: "/perfil" },
    ];

    if (!resumen.puedeVerModoRenter) {
      enlacesPerfil.push({
        label: "Verificarme como Arrendatario",
        to: "/verificar-renter",
      });
    }

    return {
      enlacesPrincipales: [
        { label: "Mi Panel", to: "/dashboard" },
        { label: "Catálogo", to: "/motos" },
        { label: "Rentas", to: "/rentas" },
        { label: "Publicar moto", to: "/publicarmoto", destacado: true },
      ],
      enlacesMenuPerfil: enlacesPerfil,
      etiquetaRolNav: "Propietario",
      varianteRolNav: "owner",
    };
  }

  if (modo === "RENTER") {
    const enlacesPerfil: EnlaceNavegacion[] = [
      { label: "Mi Perfil y Verificaciones", to: "/perfil" },
    ];

    if (!resumen.puedeVerModoOwner) {
      enlacesPerfil.push({
        label: "Verificarme como Propietario",
        to: "/verificar-owner",
      });
    }

    return {
      enlacesPrincipales: [
        { label: "Mi Panel", to: "/dashboard" },
        { label: "Catálogo", to: "/motos" },
        { label: "Mis Rentas", to: "/rentas" },
      ],
      enlacesMenuPerfil: enlacesPerfil,
      etiquetaRolNav: "Arrendatario",
      varianteRolNav: "renter",
    };
  }

  return {
    enlacesPrincipales: [
      { label: "Mi Panel", to: "/dashboard" },
      { label: "Catálogo", to: "/motos" },
    ],
    enlacesMenuPerfil: [
      { label: "Mi Perfil y Verificaciones", to: "/perfil" },
      { label: "Verificarme como Arrendatario", to: "/verificar-renter" },
      { label: "Verificarme como Propietario", to: "/verificar-owner" },
    ],
    etiquetaRolNav: "Cuenta base",
    varianteRolNav: "user",
  };
}

export type RolRutaProtegida = "RENTER" | "OWNER" | "ADMIN";

export function tienePermisoParaRuta(
  resumen: ResumenRolesUsuario,
  rolesPermitidos: RolRutaProtegida[]
): boolean {
  if (rolesPermitidos.includes("ADMIN") && resumen.esAdmin) {
    return true;
  }
  if (rolesPermitidos.includes("OWNER") && resumen.puedeVerModoOwner) {
    return true;
  }
  if (rolesPermitidos.includes("RENTER") && resumen.puedeVerModoRenter) {
    return true;
  }
  return false;
}
