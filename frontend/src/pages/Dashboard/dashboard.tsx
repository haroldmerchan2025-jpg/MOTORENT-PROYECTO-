import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconAlert } from "../../components/Icons";
import {
  cargarDatosDashboard,
  ESTADISTICAS_INICIALES,
  leerUsuarioLocal,
  type EstadisticasDashboard,
  type RentaActiva,
} from "../../services/dashboard.service";
import {
  EVENTO_CAMBIO_ROL,
  leerModoActivo,
  limpiarEstadoRolTemporal,
  notificarCambioRol,
} from "../../utils/rolActivo.storage";
import {
  obtenerResumenRoles,
  type ModoDashboard,
  type UsuarioSesion,
} from "../../utils/roles.utils";
import DashboardAdminView from "./components/DashboardAdminView";
import DashboardOwnerView from "./components/DashboardOwnerView";
import DashboardRenterView from "./components/DashboardRenterView";
import DashboardUserView from "./components/DashboardUserView";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() =>
    leerUsuarioLocal()
  );
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard>(
    ESTADISTICAS_INICIALES
  );
  const [rentaActiva, setRentaActiva] = useState<RentaActiva | null>(null);
  const [cargando, setCargando] = useState(true);
  const [advertenciaApi, setAdvertenciaApi] = useState<string | null>(null);

  const [modoManual, setModoManual] = useState<ModoDashboard | null>(() =>
    leerModoActivo()
  );

  useEffect(() => {
    let componenteActivo = true;

    async function inicializar() {
      const resultado = await cargarDatosDashboard();

      if (!componenteActivo) return;

      if (resultado.sesionExpirada) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        limpiarEstadoRolTemporal();
        navigate("/login", { replace: true });
        return;
      }

      setUsuario(resultado.usuario);
      setEstadisticas(resultado.estadisticas);
      setRentaActiva(resultado.rentaActiva);
      setAdvertenciaApi(resultado.advertenciaApi);
      setCargando(false);
      notificarCambioRol();
    }

    inicializar();

    return () => {
      componenteActivo = false;
    };
  }, [navigate]);

  useEffect(() => {
    function sincronizarDesdeNavbar() {
      setModoManual(leerModoActivo());
    }

    window.addEventListener(EVENTO_CAMBIO_ROL, sincronizarDesdeNavbar);
    return () => {
      window.removeEventListener(EVENTO_CAMBIO_ROL, sincronizarDesdeNavbar);
    };
  }, []);

  const resumenActivo = obtenerResumenRoles(usuario);

  const modoActual: ModoDashboard =
    resumenActivo.esUsuarioDual &&
    (modoManual === "RENTER" || modoManual === "OWNER")
      ? modoManual
      : resumenActivo.modoInicial;

  const nombre = usuario?.fullName ? usuario.fullName.split(" ")[0] : "";

  if (cargando) {
    return (
      <div className="dashboard">
        <main className="dashboard-content dashboard-loading">
          <p className="dashboard-loading-text">Cargando tu panel de control...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <section className="welcome-banner welcome-banner--flex">
          <div>
            <div className="welcome-badges">
              <span className="welcome-tag">PANEL DE CONTROL</span>
              <span className="role-header-badge">
                {resumenActivo.esUsuarioDual
                  ? modoActual === "OWNER"
                    ? "Perfil Dual · Modo Propietario"
                    : "Perfil Dual · Modo Arrendatario"
                  : resumenActivo.etiquetaRol}
              </span>
            </div>

            <h1>Bienvenido{nombre ? `, ${nombre}` : ""}</h1>

            <p className="welcome-description">
              {modoActual === "USER" &&
                "Completa tu verificación para comenzar a alquilar o publicar motocicletas."}
              {modoActual === "RENTER" &&
                "Consulta tu renta activa, tu historial de viajes y el catálogo disponible."}
              {modoActual === "OWNER" &&
                "Supervisa tus motocicletas publicadas, entregas y ganancias netas."}
              {modoActual === "ADMIN" &&
                "Supervisión de cuentas, documentos de verificación y catálogo general."}
              {resumenActivo.esUsuarioDual &&
                " Puedes alternar entre tus perfiles desde el menú de tu avatar en la barra superior."}
            </p>
          </div>
        </section>

        {advertenciaApi && (
          <div className="dashboard-warning-banner" role="status">
            <IconAlert size={17} />
            <span>{advertenciaApi}</span>
          </div>
        )}

        {modoActual === "USER" && <DashboardUserView resumen={resumenActivo} />}

        {modoActual === "RENTER" && (
          <DashboardRenterView
            estadisticas={estadisticas}
            rentaActiva={rentaActiva}
            resumen={resumenActivo}
          />
        )}

        {modoActual === "OWNER" && (
          <DashboardOwnerView
            estadisticas={estadisticas}
            resumen={resumenActivo}
          />
        )}

        {modoActual === "ADMIN" && <DashboardAdminView />}
      </main>
    </div>
  );
}

export default Dashboard;
