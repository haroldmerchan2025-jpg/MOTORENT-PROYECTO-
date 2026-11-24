import { Link } from "react-router-dom";
import {
  IconKey,
  IconPlus,
  IconShieldCheck,
  IconWallet,
} from "../../../components/Icons";
import type { EstadisticasDashboard } from "../../../services/dashboard.service";
import type { ResumenRolesUsuario } from "../../../utils/roles.utils";

interface DashboardOwnerViewProps {
  estadisticas: EstadisticasDashboard;
  resumen: ResumenRolesUsuario;
}

function DashboardOwnerView({
  estadisticas,
  resumen,
}: DashboardOwnerViewProps) {
  return (
    <>
      <section className="stats-row">
        <div className="stat-card">
          <div className="icon-chip icon-chip--primary">
            <IconKey size={19} />
          </div>
          <p className="stat-number">{estadisticas.motosPublicadas}</p>
          <p className="stat-label">Motos publicadas</p>
        </div>

        <div className="stat-card highlight">
          <div className="icon-chip icon-chip--success">
            <IconWallet size={19} />
          </div>
          <p className="stat-number">
            ${estadisticas.gananciasDelMes.toLocaleString("es-CO")}
          </p>
          <p className="stat-label">Ganancias este mes (85% COP)</p>
        </div>

        <div className="stat-card">
          <div className="icon-chip icon-chip--accent">
            <IconShieldCheck size={19} />
          </div>
          <p className="stat-number">Habilitado</p>
          <p className="stat-label">Perfil de propietario</p>
        </div>
      </section>

      <section className="owner-promo-card">
        <div className="owner-promo-text">
          <h3>Suma una nueva motocicleta a tu flota</h3>
          <p>
            Registra placa, cilindraje, tarifa diaria y fotografía. Recibes el
            85% neto por cada alquiler completado con arrendatarios verificados.
          </p>
        </div>
        <Link to="/publicarmoto" className="btn-promo-publish">
          <IconPlus size={16} />
          <span>Publicar motocicleta</span>
        </Link>
      </section>

      {!resumen.puedeVerModoRenter && (
        <section className="secondary-role-banner">
          <div>
            <strong>
              {resumen.estadoRenter === "PENDING"
                ? "Tu verificación como arrendatario está en revisión"
                : "¿También deseas alquilar motos de otros propietarios?"}
            </strong>
            <p>
              {resumen.estadoRenter === "PENDING"
                ? "Cuando se apruebe podrás alternar entre Propietario y Arrendatario desde este panel y la barra superior."
                : "Completa el registro de tu licencia de conducción A1/A2 para habilitar el perfil de arrendatario."}
            </p>
          </div>
          {resumen.estadoRenter !== "PENDING" && (
            <Link to="/verificar-renter" className="secondary-role-link">
              Verificarme como Arrendatario →
            </Link>
          )}
        </section>
      )}

      <div className="section-title-box">
        <h2>Gestión de propietario</h2>
        <p>Administra tus vehículos, tarifas y perfil de anfitrión</p>
      </div>

      <section className="quick-actions">
        <Link to="/publicarmoto" className="action-card">
          <div className="action-number">01</div>
          <h3>Publicar motocicleta</h3>
          <p>
            Registra un nuevo vehículo y calcula en tiempo real tu ganancia neta
            por día.
          </p>
          <span className="action-link">Ir a publicar →</span>
        </Link>

        <Link to="/motos" className="action-card">
          <div className="action-number">02</div>
          <h3>Ver catálogo público</h3>
          <p>
            Revisa cómo se presentan tus motocicletas y consulta tarifas de
            referencia en la plataforma.
          </p>
          <span className="action-link">Abrir catálogo →</span>
        </Link>

        <Link to="/perfil" className="action-card">
          <div className="action-number">03</div>
          <h3>Mi perfil y cuenta</h3>
          <p>
            Consulta los datos de tu cuenta y administra tu información de
            propietario.
          </p>
          <span className="action-link">Administrar perfil →</span>
        </Link>
      </section>
    </>
  );
}

export default DashboardOwnerView;
