import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconAlert,
  IconCheckCircle,
  IconClock,
  IconKey,
  IconMoto,
  IconShieldCheck,
  IconUser,
} from "../../components/Icons";
import {
  limpiarEstadoRolTemporal,
  notificarCambioRol,
} from "../../utils/rolActivo.storage";
import {
  obtenerInfoBadgeEstado,
  obtenerResumenRoles,
  type UsuarioSesion,
} from "../../utils/roles.utils";
import "./perfil.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface PerfilExtendido extends UsuarioSesion {
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  renter?: {
    cedulaNumero?: string;
    licenseNumber?: string;
    licenseCategory?: string;
    estadoVerificacion?: string;
    motivoRechazo?: string | null;
  } | null;
  owner?: {
    cedulaNumero?: string;
    estadoVerificacion?: string;
    motivoRechazo?: string | null;
  } | null;
}

function leerUsuarioInicial(): PerfilExtendido {
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined" && raw !== "null") {
      return JSON.parse(raw) as PerfilExtendido;
    }
  } catch {
    // ignoramos JSON inválido
  }
  return {
    fullName: "Cargando perfil...",
    username: "",
    email: "",
    phone: "",
  };
}

function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<PerfilExtendido>(() =>
    leerUsuarioInicial()
  );
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [tabActiva, setTabActiva] = useState<"datos" | "renter" | "owner">(
    "datos"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login", { replace: true });
      return;
    }

    let activo = true;

    async function cargarPerfil() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => ({}));
        if (!activo) return;

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          limpiarEstadoRolTemporal();
          navigate("/login", { replace: true });
          return;
        }

        if (!res.ok) {
          throw new Error(
            data.mensaje || data.message || "No se pudo consultar tu perfil."
          );
        }

        const userRecibido = (data.user || data.data?.user || null) as
          | PerfilExtendido
          | null;

        if (userRecibido) {
          setUsuario(userRecibido);
          localStorage.setItem("user", JSON.stringify(userRecibido));
          notificarCambioRol();
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        if (activo) {
          setErrorCarga(
            "No fue posible sincronizar con el servidor. Mostrando los datos guardados localmente."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, [navigate]);

  const resumen = obtenerResumenRoles(usuario);
  const badgeRenter = obtenerInfoBadgeEstado(resumen.estadoRenter);
  const badgeOwner = obtenerInfoBadgeEstado(resumen.estadoOwner);

  const inicial =
    usuario.fullName && usuario.fullName !== "Cargando perfil..."
      ? usuario.fullName.charAt(0).toUpperCase()
      : "U";

  return (
    <div className="perfil-page">
      <main className="perfil-content">
        <div className="perfil-header-box">
          <div className="avatar-circle">{inicial}</div>
          <div className="perfil-header-meta">
            <div className="perfil-header-badges">
              <span className="perfil-role-pill">{resumen.etiquetaRol}</span>
              {cargando && (
                <span className="perfil-sync-pill">Sincronizando...</span>
              )}
            </div>
            <h1>{usuario.fullName || "Usuario MotoRent"}</h1>
            <p className="user-email">
              {usuario.email || "Sin correo registrado"}
              {usuario.username ? ` · @${usuario.username}` : ""}
            </p>
          </div>
        </div>

        {errorCarga && (
          <div className="perfil-warning-banner" role="status">
            <IconAlert size={17} />
            <span>{errorCarga}</span>
          </div>
        )}

        <div className="perfil-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === "datos"}
            className={tabActiva === "datos" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTabActiva("datos")}
          >
            <IconUser size={16} />
            <span>Datos de la cuenta</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === "renter"}
            className={tabActiva === "renter" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTabActiva("renter")}
          >
            <IconMoto size={16} />
            <span>Verificación Arrendatario</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === "owner"}
            className={tabActiva === "owner" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTabActiva("owner")}
          >
            <IconKey size={16} />
            <span>Verificación Propietario</span>
          </button>
        </div>

        {tabActiva === "datos" && (
          <section className="perfil-card">
            <div className="card-top-row">
              <h2>Información de tu cuenta</h2>
              <Link to="/dashboard" className="perfil-secondary-link">
                Ir a mi panel →
              </Link>
            </div>
            <p className="perfil-card-subtitle">
              Datos básicos asociados a tu registro en MotoRent y estado actual
              de tu cuenta.
            </p>

            <div className="perfil-datos-grid">
              <div className="perfil-dato">
                <span className="perfil-dato-label">Nombre completo</span>
                <span className="perfil-dato-valor">
                  {usuario.fullName || "No definido"}
                </span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Nombre de usuario</span>
                <span className="perfil-dato-valor">
                  {usuario.username ? `@${usuario.username}` : "No definido"}
                </span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Correo electrónico</span>
                <span className="perfil-dato-valor">
                  {usuario.email || "No definido"}
                </span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Teléfono de contacto</span>
                <span className="perfil-dato-valor">
                  {usuario.phone ? `+57 ${usuario.phone}` : "No definido"}
                </span>
              </div>
            </div>
          </section>
        )}

        {tabActiva === "renter" && (
          <section className="perfil-card">
            <div className="card-top-row">
              <h2>Perfil de Arrendatario (Renter)</h2>
              <span
                className={`perfil-status-pill perfil-status-pill--${badgeRenter.variante}`}
              >
                {badgeRenter.texto}
              </span>
            </div>
            <p className="perfil-card-subtitle">
              Para alquilar motocicletas en MotoRent validamos tu cédula,
              licencia de conducción categoría A1/A2 y comprobante de domicilio.
            </p>

            {resumen.estadoRenter === "APPROVED" ? (
              <>
                <div className="perfil-state-box perfil-state-box--approved">
                  <IconCheckCircle size={19} />
                  <div>
                    <strong>Cuenta habilitada para alquilar</strong>
                    <p>
                      Tu documentación de arrendatario fue aprobada. Puedes
                      explorar el catálogo y gestionar tus reservas activas.
                    </p>
                  </div>
                </div>

                <div className="perfil-datos-grid">
                  <div className="perfil-dato">
                    <span className="perfil-dato-label">Número de cédula</span>
                    <span className="perfil-dato-valor">
                      {usuario.renter?.cedulaNumero || "Verificada"}
                    </span>
                  </div>
                  <div className="perfil-dato">
                    <span className="perfil-dato-label">
                      Licencia de conducción
                    </span>
                    <span className="perfil-dato-valor">
                      {usuario.renter?.licenseNumber
                        ? `${usuario.renter.licenseNumber} (${usuario.renter.licenseCategory || "Moto"})`
                        : "Verificada"}
                    </span>
                  </div>
                </div>

                <div className="perfil-cta-row">
                  <Link to="/motos" className="perfil-primary-btn">
                    Explorar catálogo
                  </Link>
                  <Link to="/rentas" className="perfil-outline-btn">
                    Ver mis rentas
                  </Link>
                </div>
              </>
            ) : resumen.estadoRenter === "PENDING" ? (
              <div className="perfil-state-box perfil-state-box--pending">
                <IconClock size={19} />
                <div>
                  <strong>Documentación en revisión</strong>
                  <p>
                    Recibimos tu solicitud de arrendatario. Nuestro equipo
                    administrador está validando tus soportes y te notificará
                    apenas quede aprobada.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {resumen.estadoRenter === "REJECTED" && (
                  <div className="perfil-state-box perfil-state-box--rejected">
                    <IconAlert size={19} />
                    <div>
                      <strong>Solicitud rechazada</strong>
                      <p>
                        {resumen.motivoRechazoRenter ||
                          "Algunos documentos no pudieron validarse. Corrige los datos y vuelve a enviar tu solicitud."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="perfil-state-box perfil-state-box--neutral">
                  <IconShieldCheck size={19} />
                  <div>
                    <strong>Completa tu verificación oficial en 3 pasos</strong>
                    <p>
                      Prepara tu cédula, tu licencia A1 o A2 y un recibo de
                      servicio público reciente (imagen o PDF).
                    </p>
                  </div>
                </div>

                <div className="perfil-cta-row">
                  <Link to="/verificar-renter" className="perfil-primary-btn">
                    {resumen.estadoRenter === "REJECTED"
                      ? "Reenviar verificación de Arrendatario"
                      : "Iniciar verificación de Arrendatario"}
                  </Link>
                </div>
              </>
            )}
          </section>
        )}

        {tabActiva === "owner" && (
          <section className="perfil-card">
            <div className="card-top-row">
              <h2>Perfil de Propietario (Owner)</h2>
              <span
                className={`perfil-status-pill perfil-status-pill--${badgeOwner.variante}`}
              >
                {badgeOwner.texto}
              </span>
            </div>
            <p className="perfil-card-subtitle">
              Como propietario verificado puedes publicar tus motocicletas y
              recibir el 85% de cada alquiler completado.
            </p>

            {resumen.estadoOwner === "APPROVED" ? (
              <>
                <div className="perfil-state-box perfil-state-box--approved">
                  <IconCheckCircle size={19} />
                  <div>
                    <strong>Cuenta habilitada como Propietario</strong>
                    <p>
                      Tu identidad fue verificada correctamente. Ya tienes
                      acceso a la publicación de vehículos en MotoRent.
                    </p>
                  </div>
                </div>

                <div className="perfil-datos-grid">
                  <div className="perfil-dato">
                    <span className="perfil-dato-label">Número de cédula</span>
                    <span className="perfil-dato-valor">
                      {usuario.owner?.cedulaNumero || "Verificada"}
                    </span>
                  </div>
                  <div className="perfil-dato">
                    <span className="perfil-dato-label">Esquema de ingresos</span>
                    <span className="perfil-dato-valor">
                      85% neto para propietario
                    </span>
                  </div>
                </div>

                <div className="perfil-cta-row">
                  <Link to="/publicarmoto" className="perfil-primary-btn">
                    Publicar motocicleta
                  </Link>
                  <Link to="/dashboard" className="perfil-outline-btn">
                    Ver métricas del panel
                  </Link>
                </div>
              </>
            ) : resumen.estadoOwner === "PENDING" ? (
              <div className="perfil-state-box perfil-state-box--pending">
                <IconClock size={19} />
                <div>
                  <strong>Solicitud de propietario en revisión</strong>
                  <p>
                    Tus documentos de identidad y domicilio están siendo
                    validados por el equipo administrador.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {resumen.estadoOwner === "REJECTED" && (
                  <div className="perfil-state-box perfil-state-box--rejected">
                    <IconAlert size={19} />
                    <div>
                      <strong>Solicitud rechazada</strong>
                      <p>
                        {resumen.motivoRechazoOwner ||
                          "No pudimos aprobar tu documentación. Revisa los requisitos y vuelve a enviarla."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="perfil-state-box perfil-state-box--neutral">
                  <IconShieldCheck size={19} />
                  <div>
                    <strong>Completa tu verificación oficial en 2 pasos</strong>
                    <p>
                      Necesitarás tu cédula (frontal y posterior), una foto de
                      rostro reciente y tu comprobante de domicilio.
                    </p>
                  </div>
                </div>

                <div className="perfil-cta-row">
                  <Link to="/verificar-owner" className="perfil-primary-btn">
                    {resumen.estadoOwner === "REJECTED"
                      ? "Reenviar verificación de Propietario"
                      : "Iniciar verificación de Propietario"}
                  </Link>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Perfil;
