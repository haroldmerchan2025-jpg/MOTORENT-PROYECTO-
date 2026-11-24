import "./Navbar.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { leerUsuarioLocal } from "../services/dashboard.service";
import {
  EVENTO_CAMBIO_ROL,
  guardarModoActivo,
  leerModoActivo,
  limpiarEstadoRolTemporal,
} from "../utils/rolActivo.storage";
import {
  obtenerNavegacionPorRol,
  obtenerResumenRoles,
  type ModoDashboard,
} from "../utils/roles.utils";
import {
  IconBell,
  IconClose,
  IconLogout,
  IconMenu,
  IconPlus,
  IconShieldCheck,
  IconSwitch,
  IconUser,
} from "./Icons";

interface ConfirmacionCambioPerfil {
  modoDestino: "RENTER" | "OWNER";
  titulo: string;
  descripcion: string;
  etiquetaOrigen: string;
  etiquetaDestino: string;
  textoConfirmar: string;
}

function construirMensajeCambio(origen: "RENTER" | "OWNER"): ConfirmacionCambioPerfil {
  if (origen === "OWNER") {
    return {
      modoDestino: "RENTER",
      titulo: "¿Cambiar a Modo Arrendatario?",
      descripcion:
        "Tu panel y la barra de navegación mostrarán tus rentas activas, historial de viajes y catálogo para alquilar.",
      etiquetaOrigen: "Propietario",
      etiquetaDestino: "Arrendatario",
      textoConfirmar: "Cambiar a Arrendatario",
    };
  }
  return {
    modoDestino: "OWNER",
    titulo: "¿Cambiar a Modo Propietario?",
    descripcion:
      "Tu panel y la barra de navegación mostrarán tus motocicletas publicadas, ganancias del 85% y opciones de publicación.",
    etiquetaOrigen: "Arrendatario",
    etiquetaDestino: "Propietario",
    textoConfirmar: "Cambiar a Propietario",
  };
}

function renderIconoMenu(ruta: string) {
  if (ruta === "/verificar-renter" || ruta === "/verificar-owner") {
    return <IconShieldCheck size={16} />;
  }
  return <IconUser size={16} />;
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [, setVersionRol] = useState(0);

  const [menuNotificaciones, setMenuNotificaciones] = useState(false);
  const [menuPerfil, setMenuPerfil] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const [confirmacionCambio, setConfirmacionCambio] =
    useState<ConfirmacionCambioPerfil | null>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const perfilRef = useRef<HTMLDivElement>(null);

  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      titulo: "Estado de verificación",
      mensaje: "Revisa el progreso de tus documentos desde tu panel de control.",
      tiempo: "Reciente",
      leida: false,
    },
    {
      id: 2,
      titulo: "Recordatorio de plataforma",
      mensaje: "Mantén tus datos de contacto actualizados en Mi Perfil.",
      tiempo: "Hoy",
      leida: true,
    },
  ]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  useEffect(() => {
    function sincronizarNavbar() {
      setVersionRol((v) => v + 1);
    }

    window.addEventListener(EVENTO_CAMBIO_ROL, sincronizarNavbar);
    window.addEventListener("storage", sincronizarNavbar);
    return () => {
      window.removeEventListener(EVENTO_CAMBIO_ROL, sincronizarNavbar);
      window.removeEventListener("storage", sincronizarNavbar);
    };
  }, []);

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
        setMenuMovil(false);
        setConfirmacionCambio(null);
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

  const token = localStorage.getItem("token");
  const haySesion = Boolean(
    token && token !== "undefined" && token !== "null"
  );
  const usuarioActual = haySesion ? leerUsuarioLocal() : null;
  const inicial = usuarioActual?.fullName
    ? usuarioActual.fullName.charAt(0).toUpperCase()
    : "U";

  const resumenActivo = haySesion ? obtenerResumenRoles(usuarioActual) : null;

  const modoGuardado = leerModoActivo();
  const modoActual: ModoDashboard | null =
    resumenActivo &&
    resumenActivo.esUsuarioDual &&
    (modoGuardado === "RENTER" || modoGuardado === "OWNER")
      ? modoGuardado
      : resumenActivo?.modoInicial ?? null;

  const navConfig = obtenerNavegacionPorRol(
    haySesion,
    resumenActivo,
    modoActual
  );

  function handleLogout() {
    setMenuPerfil(false);
    setMenuMovil(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    limpiarEstadoRolTemporal();
    navigate("/login", { replace: true });
  }

  function solicitarCambioModoDual() {
    const origen: "RENTER" | "OWNER" = modoActual === "OWNER" ? "OWNER" : "RENTER";
    setMenuPerfil(false);
    setConfirmacionCambio(construirMensajeCambio(origen));
  }

  function confirmarCambioModoDual() {
    if (!confirmacionCambio) return;
    const { modoDestino } = confirmacionCambio;
    setConfirmacionCambio(null);
    guardarModoActivo(modoDestino);
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
  }

  function marcarLeidas() {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  }

  return (
    <header className="global-navbar">
      {/* IZQUIERDA: LOGO */}
      <Link to={haySesion ? "/dashboard" : "/"} className="navbar-logo">
        <span>MOTO</span>RENT
      </Link>

      {/* CENTRO: ENLACES ADAPTADOS AL ROL ACTIVO */}
      <nav className="navbar-links" aria-label="Navegación principal">
        {navConfig.enlacesPrincipales.map((enlace) => (
          <Link
            key={enlace.to}
            to={enlace.to}
            className={[
              enlace.destacado ? "nav-btn-publish" : "",
              location.pathname === enlace.to ? "active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {enlace.destacado && <IconPlus size={15} />}
            <span>{enlace.label}</span>
          </Link>
        ))}
      </nav>

      {/* DERECHA: ROL ACTIVO, NOTIFICACIONES Y PERFIL */}
      <div className="navbar-right">
        {haySesion ? (
          <>
            {navConfig.etiquetaRolNav && navConfig.varianteRolNav && (
              <span
                className={`navbar-role-pill navbar-role-pill--${navConfig.varianteRolNav}`}
              >
                {navConfig.etiquetaRolNav}
              </span>
            )}

            {/* Notificaciones */}
            <div className="dropdown-container" ref={notifRef}>
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  setMenuNotificaciones(!menuNotificaciones);
                  setMenuPerfil(false);
                }}
                aria-label="Notificaciones"
                title="Notificaciones"
              >
                <IconBell size={18} />
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

            {/* Menú de Perfil */}
            <div className="dropdown-container" ref={perfilRef}>
              <button
                type="button"
                className="avatar-button"
                onClick={() => {
                  setMenuPerfil(!menuPerfil);
                  setMenuNotificaciones(false);
                }}
                aria-label="Menú de cuenta"
              >
                {inicial}
              </button>

              {menuPerfil && (
                <div className="dropdown-menu profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="avatar-small">{inicial}</div>
                    <div className="profile-dropdown-meta">
                      <p className="profile-name">
                        {usuarioActual?.fullName || "Mi cuenta"}
                      </p>
                      <p className="profile-role">
                        {usuarioActual?.email || "Usuario activo"}
                      </p>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  {navConfig.enlacesMenuPerfil.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="dropdown-link"
                      onClick={() => setMenuPerfil(false)}
                    >
                      {renderIconoMenu(item.to)}
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {resumenActivo?.esUsuarioDual && (
                    <>
                      <div className="dropdown-divider" />
                      <button
                        type="button"
                        className="dropdown-link dropdown-link--switch"
                        onClick={solicitarCambioModoDual}
                      >
                        <IconSwitch size={16} />
                        <span>
                          {modoActual === "OWNER"
                            ? "Cambiar a Arrendatario"
                            : "Cambiar a Propietario"}
                        </span>
                      </button>
                    </>
                  )}

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-link logout-link"
                    onClick={handleLogout}
                  >
                    <IconLogout size={16} />
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

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuMovil ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={menuMovil}
          aria-controls="nav-mobile-drawer"
          onClick={() => {
            setMenuMovil((prev) => !prev);
            setMenuPerfil(false);
            setMenuNotificaciones(false);
          }}
        >
          {menuMovil ? <IconClose size={20} /> : <IconMenu size={20} />}
        </button>
      </div>

      {menuMovil && (
        <nav
          id="nav-mobile-drawer"
          className="mobile-nav-drawer"
          aria-label="Navegación móvil"
        >
          {navConfig.enlacesPrincipales.map((enlace) => (
            <Link
              key={enlace.to}
              to={enlace.to}
              className={[
                "mobile-nav-link",
                enlace.destacado ? "mobile-nav-link--accent" : "",
                location.pathname === enlace.to ? "active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setMenuMovil(false)}
            >
              {enlace.destacado && <IconPlus size={15} />}
              <span>{enlace.label}</span>
            </Link>
          ))}
          {!haySesion && (
            <div className="mobile-guest-actions">
              <Link
                to="/login"
                className="mobile-nav-link"
                onClick={() => setMenuMovil(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="mobile-nav-link mobile-nav-link--accent"
                onClick={() => setMenuMovil(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      )}

      {confirmacionCambio && (
        <div
          className="switch-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="switch-confirm-title"
          onClick={() => setConfirmacionCambio(null)}
        >
          <div
            className="switch-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="switch-confirm-icon" aria-hidden="true">
              <IconSwitch size={22} />
            </div>
            <h3 id="switch-confirm-title">{confirmacionCambio.titulo}</h3>
            <p className="switch-confirm-text">{confirmacionCambio.descripcion}</p>
            <div className="switch-confirm-pills">
              <span className="switch-pill switch-pill--from">
                Actual: {confirmacionCambio.etiquetaOrigen}
              </span>
              <span className="switch-pill-arrow" aria-hidden="true">→</span>
              <span className="switch-pill switch-pill--to">
                Nuevo: {confirmacionCambio.etiquetaDestino}
              </span>
            </div>
            <div className="switch-confirm-actions">
              <button
                type="button"
                className="switch-btn switch-btn--cancel"
                onClick={() => setConfirmacionCambio(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="switch-btn switch-btn--confirm"
                onClick={confirmarCambioModoDual}
              >
                {confirmacionCambio.textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
