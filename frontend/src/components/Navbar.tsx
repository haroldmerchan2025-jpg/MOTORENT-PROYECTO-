// frontend/src/components/Navbar.tsx
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------------------------------------------------------------
  // 1. VERIFICAR SESIÓN DEL USUARIO
  // ----------------------------------------------------------------------
  const token = localStorage.getItem("token");
  const haySesion = token && token !== "undefined" && token !== "null";

    // Obtener datos del usuario logueado desde localStorage
  const savedUser = localStorage.getItem("user");
  let usuarioActual: { fullName?: string; email?: string } | null = null;
  try {
    if (savedUser && savedUser !== "undefined") {
      usuarioActual = JSON.parse(savedUser);
    }
  } catch {
    usuarioActual = null;
  }
  const inicial = usuarioActual?.fullName ? usuarioActual.fullName.charAt(0).toUpperCase() : "U";

  // ----------------------------------------------------------------------
  // 2. ESTADOS PARA LOS MENÚS DESPLEGABLES (DROPDOWNS)
  // ----------------------------------------------------------------------
  const [menuNotificaciones, setMenuNotificaciones] = useState(false);
  const [menuPerfil, setMenuPerfil] = useState(false);

  // Referencias para detectar clics fuera de los menús y cerrarlos
  const notifRef = useRef<HTMLDivElement>(null);
  const perfilRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------------------------
  // 3. NOTIFICACIONES DE EJEMPLO (Conectadas luego al backend)
  // ----------------------------------------------------------------------
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      titulo: "¡Moto en revisión!",
      mensaje: "Tu Yamaha MT-03 está siendo revisada por el equipo.",
      tiempo: "Hace 10 min",
      leida: false,
    },
    {
      id: 2,
      titulo: "Recordatorio de renta",
      mensaje: "Tu entrega de moto está programada para el 22 de sep.",
      tiempo: "Hace 2 horas",
      leida: false,
    },
  ]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setMenuNotificaciones(false);
      }
      if (perfilRef.current && !perfilRef.current.contains(event.target as Node)) {
        setMenuPerfil(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función para cerrar sesión
  function handleLogout() {
    localStorage.removeItem("token");
    setMenuPerfil(false);
    navigate("/login", { replace: true });
  }

  // Marcar todas las notificaciones como leídas
  function marcarLeidas() {
    setNotificaciones(notificaciones.map((n) => ({ ...n, leida: true })));
  }

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className="global-navbar">
      {/* ------------------------------------------------------------- */}
      {/* LADO IZQUIERDO: LOGO                                          */}
      {/* ------------------------------------------------------------- */}
      <Link to="/" className="navbar-logo">
        <span>MOTO</span>RENT
      </Link>

      {/* ------------------------------------------------------------- */}
      {/* CENTRO: ENLACES PRINCIPALES                                  */}
      {/* ------------------------------------------------------------- */}
      <nav className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Inicio
        </Link>
        <Link to="/motos" className={location.pathname === "/motos" ? "active" : ""}>
          Catálogo
        </Link>
        {haySesion && (
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            Mi Panel
          </Link>
        )}
        <Link
          to="/publicarmoto"
          className={`nav-btn-publish ${location.pathname === "/publicarmoto" ? "active" : ""}`}
        >
          + Publicar Moto
        </Link>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* LADO DERECHO: NOTIFICACIONES, PERFIL O LOGIN                  */}
      {/* ------------------------------------------------------------- */}
      <div className="navbar-right">
        {haySesion ? (
          <>
            {/* 1. BOTÓN DE NOTIFICACIONES */}
            <div className="dropdown-container" ref={notifRef}>
              <button
                className="icon-button"
                onClick={() => {
                  setMenuNotificaciones(!menuNotificaciones);
                  setMenuPerfil(false);
                }}
                title="Notificaciones"
              >
                🔔
                {noLeidas > 0 && <span className="notif-badge">{noLeidas}</span>}
              </button>

              {/* MENÚ DESPLEGABLE DE NOTIFICACIONES */}
              {menuNotificaciones && (
                <div className="dropdown-menu notif-dropdown">
                  <div className="dropdown-header">
                    <h4>Notificaciones</h4>
                    {noLeidas > 0 && (
                      <button className="btn-mark-read" onClick={marcarLeidas}>
                        Marcar leídas
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notificaciones.map((n) => (
                      <div key={n.id} className={`notif-item ${!n.leida ? "unread" : ""}`}>
                        <p className="notif-title">{n.titulo}</p>
                        <p className="notif-desc">{n.mensaje}</p>
                        <span className="notif-time">{n.tiempo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. BOTÓN DE PERFIL / AVATAR */}
            <div className="dropdown-container" ref={perfilRef}>
              <button
                className="avatar-button"
                onClick={() => {
                  setMenuPerfil(!menuPerfil);
                  setMenuNotificaciones(false);
                }}
              >
                {inicial}
              </button>

              {/* MENÚ DESPLEGABLE DE PERFIL */}
              {menuPerfil && (
                <div className="dropdown-menu profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="avatar-small">{inicial}</div>
                    <div>
                      <p className="profile-name">{usuarioActual?.fullName || "Mi cuenta"}</p>
                      <p className="profile-role">{usuarioActual?.email || "usuario" }</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/perfil" className="dropdown-link">
                    👤 Mi Perfil y Documentos
                  </Link>
                  <Link to="/dashboard" className="dropdown-link">
                    📊 Mi Panel de Control
                  </Link>
                  <Link to="/publicarmoto" className="dropdown-link">
                    🏍️ Publicar una moto
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-link logout-link" onClick={handleLogout}>
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* SI NO HAY SESIÓN: BOTONES DE ACCESO */
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