// frontend/src/components/Navbar.tsx
import "./Navbar.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface PerfilVerificacion {
  estadoVerificacion?: string;
}

interface UsuarioNavbar {
  fullName?: string;
  email?: string;
  role?: string;
  renter?: PerfilVerificacion | null;
  owner?: PerfilVerificacion | null;
}

function leerUsuarioGuardado(): UsuarioNavbar | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw) as UsuarioNavbar;
  } catch {
    return null;
  }
}

/* Íconos SVG vectoriales minimalistas (sin emojis) */
const svgBase = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const IconBell = () => (
  <svg {...svgBase} width={18} height={18}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconUser = () => (
  <svg {...svgBase}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconDashboard = () => (
  <svg {...svgBase}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconShield = () => (
  <svg {...svgBase}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconKey = () => (
  <svg {...svgBase}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
);

const IconPlus = () => (
  <svg {...svgBase} width={15} height={15}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconLogout = () => (
  <svg {...svgBase}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const haySesion = Boolean(token && token !== "undefined" && token !== "null");

  const [usuarioRemoto, setUsuarioRemoto] = useState<UsuarioNavbar | null>(null);
  const usuarioActual: UsuarioNavbar | null = haySesion
    ? usuarioRemoto ?? leerUsuarioGuardado()
    : null;
  const [menuNotificaciones, setMenuNotificaciones] = useState(false);
  const [menuPerfil, setMenuPerfil] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const perfilRef = useRef<HTMLDivElement>(null);

  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      titulo: "Estado de verificación",
      mensaje: "Revisa el avance de tus documentos desde tu panel o menú de perfil.",
      tiempo: "Reciente",
      leida: false,
    },
    {
      id: 2,
      titulo: "Bienvenido a MotoRent",
      mensaje: "Completa tu perfil para alquilar o publicar motocicletas.",
      tiempo: "Hoy",
      leida: true,
    },
  ]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  // Sincronizar rol y estado real de Renter/Owner desde /auth/me al navegar
  useEffect(() => {
    if (!haySesion || !token) return;

    let activo = true;

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!activo || !data?.ok || !data?.user) return;
        setUsuarioRemoto(data.user as UsuarioNavbar);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch(() => {
        // Si el backend no responde momentáneamente, mantenemos el usuario en caché
      });

    return () => {
      activo = false;
    };
  }, [haySesion, token, location.pathname]);

  // Cerrar menús al hacer clic fuera o presionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setMenuNotificaciones(false);
      }
      if (perfilRef.current && !perfilRef.current.contains(event.target as Node)) {
        setMenuPerfil(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuNotificaciones(false);
        setMenuPerfil(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/recuperar-password" ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/verificar-correo")
  ) {
    return null;
  }

  // Cálculo claro del rol y estados de verificación del usuario actual
  const rol = (usuarioActual?.role || "USER").toUpperCase();
  const estadoRenter = (usuarioActual?.renter?.estadoVerificacion || "").toUpperCase();
  const estadoOwner = (usuarioActual?.owner?.estadoVerificacion || "").toUpperCase();

  const esAdmin = rol === "ADMIN";
  const esRenterAprobado = esAdmin || rol === "RENTER" || estadoRenter === "APPROVED";
  const esOwnerAprobado = esAdmin || rol === "OWNER" || estadoOwner === "APPROVED";

  const mostrarLinkRenter = !esAdmin && !esRenterAprobado;
  const mostrarLinkOwner = !esAdmin && !esOwnerAprobado;
  const mostrarSeccionVerificacion = mostrarLinkRenter || mostrarLinkOwner;

  const tieneSolicitudPendiente =
    estadoRenter === "PENDING" || estadoOwner === "PENDING";

  const etiquetaRol = esAdmin
    ? "Administrador"
    : esRenterAprobado && esOwnerAprobado
    ? "Propietario y Arrendatario"
    : esOwnerAprobado
    ? "Propietario"
    : esRenterAprobado
    ? "Arrendatario"
    : tieneSolicitudPendiente
    ? "En verificación"
    : "Cuenta base";

  const varianteRol = esAdmin
    ? "admin"
    : esOwnerAprobado
    ? "owner"
    : esRenterAprobado
    ? "renter"
    : tieneSolicitudPendiente
    ? "pending"
    : "user";

  const inicial = usuarioActual?.fullName
    ? usuarioActual.fullName.trim().charAt(0).toUpperCase()
    : "U";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsuarioRemoto(null);
    setMenuPerfil(false);
    navigate("/login", { replace: true });
  }

  function marcarLeidas() {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  }

  function renderBadgeEstado(estado: string) {
    if (estado === "PENDING") {
      return <span className="nav-status-pill nav-status-pill--pending">En revisión</span>;
    }
    if (estado === "REJECTED") {
      return <span className="nav-status-pill nav-status-pill--rejected">Corregir</span>;
    }
    return null;
  }

  return (
    <header className="global-navbar">
      {/* LOGO */}
      <Link to={haySesion ? "/dashboard" : "/"} className="navbar-logo">
        <span>MOTO</span>RENT
      </Link>

      {/* ENLACES PRINCIPALES ADAPTADOS AL ROL */}
      <nav className="navbar-links" aria-label="Navegación principal">
        {!haySesion && (
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Inicio
          </Link>
        )}
        {haySesion && (
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            Mi Panel
          </Link>
        )}
        <Link to="/motos" className={location.pathname === "/motos" ? "active" : ""}>
          Catálogo
        </Link>
        {haySesion && esRenterAprobado && (
          <Link to="/rentas" className={location.pathname === "/rentas" ? "active" : ""}>
            Mis Rentas
          </Link>
        )}
        {haySesion && esOwnerAprobado && (
          <Link
            to="/publicarmoto"
            className={`nav-btn-publish ${
              location.pathname === "/publicarmoto" ? "active" : ""
            }`}
          >
            <IconPlus />
            <span>Publicar moto</span>
          </Link>
        )}
      </nav>

      {/* ACCIONES DERECHA */}
      <div className="navbar-right">
        {haySesion ? (
          <>
            <span className={`navbar-role-pill navbar-role-pill--${varianteRol}`}>
              {etiquetaRol}
            </span>

            {/* NOTIFICACIONES */}
            <div className="dropdown-container" ref={notifRef}>
              <button
                type="button"
                className="icon-button"
                aria-label="Notificaciones"
                aria-expanded={menuNotificaciones}
                onClick={() => {
                  setMenuNotificaciones((prev) => !prev);
                  setMenuPerfil(false);
                }}
              >
                <IconBell />
                {noLeidas > 0 && <span className="notif-badge">{noLeidas}</span>}
              </button>

              {menuNotificaciones && (
                <div className="dropdown-menu notif-dropdown">
                  <div className="dropdown-header">
                    <h4>Notificaciones</h4>
                    {noLeidas > 0 && (
                      <button
                        type="button"
                        className="btn-mark-read"
                        onClick={marcarLeidas}
                      >
                        Marcar leídas
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notificaciones.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.leida ? "unread" : ""}`}
                      >
                        <p className="notif-title">{n.titulo}</p>
                        <p className="notif-desc">{n.mensaje}</p>
                        <span className="notif-time">{n.tiempo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PERFIL / AVATAR */}
            <div className="dropdown-container" ref={perfilRef}>
              <button
                type="button"
                className="avatar-button"
                aria-label="Menú de cuenta"
                aria-expanded={menuPerfil}
                onClick={() => {
                  setMenuPerfil((prev) => !prev);
                  setMenuNotificaciones(false);
                }}
              >
                {inicial}
              </button>

              {menuPerfil && (
                <div className="dropdown-menu profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="avatar-small">{inicial}</div>
                    <div className="profile-meta">
                      <p className="profile-name">
                        {usuarioActual?.fullName || "Mi cuenta"}
                      </p>
                      <p className="profile-role">
                        {usuarioActual?.email || "Usuario registrado"}
                      </p>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <Link
                    to="/perfil"
                    className="dropdown-link"
                    onClick={() => setMenuPerfil(false)}
                  >
                    <IconUser />
                    <span>Mi Perfil y Documentos</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="dropdown-link"
                    onClick={() => setMenuPerfil(false)}
                  >
                    <IconDashboard />
                    <span>Mi Panel de Control</span>
                  </Link>

                  {mostrarSeccionVerificacion && (
                    <>
                      <div className="dropdown-divider" />
                      <span className="dropdown-section-label">
                        Verificación de perfil
                      </span>

                      {mostrarLinkRenter && (
                        <Link
                          to="/verificar-renter"
                          className="dropdown-link dropdown-link--verify"
                          onClick={() => setMenuPerfil(false)}
                        >
                          <IconShield />
                          <span className="dropdown-link-text">
                            Ser Arrendatario
                          </span>
                          {renderBadgeEstado(estadoRenter)}
                        </Link>
                      )}

                      {mostrarLinkOwner && (
                        <Link
                          to="/verificar-owner"
                          className="dropdown-link dropdown-link--verify"
                          onClick={() => setMenuPerfil(false)}
                        >
                          <IconKey />
                          <span className="dropdown-link-text">
                            Ser Propietario
                          </span>
                          {renderBadgeEstado(estadoOwner)}
                        </Link>
                      )}
                    </>
                  )}

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-link logout-link"
                    onClick={handleLogout}
                  >
                    <IconLogout />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="guest-buttons">
            <Link to="/login" className="btn-nav-login">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-nav-register">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
