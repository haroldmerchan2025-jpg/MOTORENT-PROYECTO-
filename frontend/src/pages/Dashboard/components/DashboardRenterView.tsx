import { Link } from "react-router-dom";
import {
  IconCalendar,
  IconMoto,
  IconShieldCheck,
} from "../../../components/Icons";
import type {
  EstadisticasDashboard,
  RentaActiva,
} from "../../../services/dashboard.service";
import type { ResumenRolesUsuario } from "../../../utils/roles.utils";

interface DashboardRenterViewProps {
  estadisticas: EstadisticasDashboard;
  rentaActiva: RentaActiva | null;
  resumen: ResumenRolesUsuario;
}

function DashboardRenterView({
  estadisticas,
  rentaActiva,
  resumen,
}: DashboardRenterViewProps) {
  return (
    <>
      {rentaActiva ? (
        <section className="active-rental-banner">
          <div className="icon-chip icon-chip--dark-surface">
            <IconMoto size={22} />
          </div>
          <div className="active-rental-info">
            <div className="active-rental-badge">EN CURSO</div>
            <p className="active-rental-title">
              Tienes una {rentaActiva.moto} rentada
            </p>
            <p className="active-rental-text">
              Devolución programada: <strong>{rentaActiva.fechaDevolucion}</strong>{" "}
              ({rentaActiva.diasRestantes} días restantes).
            </p>
          </div>
          <Link to="/contrato" className="active-rental-button">
            Ver contrato y acta digital →
          </Link>
        </section>
      ) : (
        <section className="empty-rental-banner">
          <div>
            <h3>Sin rentas activas en este momento</h3>
            <p>
              Tu perfil de arrendatario está verificado y listo. Explora el
              catálogo para reservar tu próxima motocicleta.
            </p>
          </div>
          <Link to="/motos" className="active-rental-button">
            Explorar catálogo →
          </Link>
        </section>
      )}

      <section className="stats-row">
        <div className="stat-card">
          <div className="icon-chip icon-chip--primary">
            <IconMoto size={19} />
          </div>
          <p className="stat-number">{estadisticas.rentasComoCliente}</p>
          <p className="stat-label">Viajes realizados</p>
        </div>

        <div className="stat-card">
          <div className="icon-chip icon-chip--neutral">
            <IconCalendar size={19} />
          </div>
          <p className="stat-number">{estadisticas.proximaDevolucion}</p>
          <p className="stat-label">Próxima entrega</p>
        </div>

        <div className="stat-card highlight">
          <div className="icon-chip icon-chip--success">
            <IconShieldCheck size={19} />
          </div>
          <p className="stat-number">Habilitado</p>
          <p className="stat-label">Perfil de arrendatario</p>
        </div>
      </section>

      {!resumen.puedeVerModoOwner && (
        <section className="secondary-role-banner">
          <div>
            <strong>
              {resumen.estadoOwner === "PENDING"
                ? "Tu solicitud de propietario está en revisión"
                : "¿Tienes una moto propia? Activa también el perfil de Propietario"}
            </strong>
            <p>
              {resumen.estadoOwner === "PENDING"
                ? "Cuando sea aprobada podrás alternar entre Arrendatario y Propietario desde este panel y la barra superior."
                : "Publica tus vehículos disponibles y recibe el 85% neto de cada contrato completado."}
            </p>
          </div>

          {resumen.estadoOwner !== "PENDING" && (
            <Link to="/verificar-owner" className="secondary-role-link">
              Verificarme como Propietario →
            </Link>
          )}
        </section>
      )}

      <div className="section-title-box">
        <h2>Operaciones de arrendatario</h2>
        <p>Accede a tus viajes, contratos y documentación personal</p>
      </div>

      <section className="quick-actions">
        <Link to="/motos" className="action-card">
          <div className="action-number">01</div>
          <h3>Explorar catálogo</h3>
          <p>
            Filtra motocicletas disponibles por categoría, cilindraje o tarifa
            diaria.
          </p>
          <span className="action-link">Ver catálogo →</span>
        </Link>

        <Link to="/rentas" className="action-card">
          <div className="action-number">02</div>
          <h3>Mis rentas</h3>
          <p>
            Consulta el detalle de tu alquiler activo y tu historial de viajes
            completados.
          </p>
          <span className="action-link">Ver mis rentas →</span>
        </Link>

        <Link to="/perfil" className="action-card">
          <div className="action-number">03</div>
          <h3>Mi perfil y licencia</h3>
          <p>
            Consulta tus datos personales y el estado de la documentación
            registrada en tu cuenta.
          </p>
          <span className="action-link">Administrar perfil →</span>
        </Link>
      </section>
    </>
  );
}

export default DashboardRenterView;
