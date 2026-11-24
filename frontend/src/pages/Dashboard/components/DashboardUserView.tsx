import { Link } from "react-router-dom";
import { IconClock, IconKey, IconMoto } from "../../../components/Icons";
import {
  obtenerInfoBadgeEstado,
  type ResumenRolesUsuario,
} from "../../../utils/roles.utils";

interface DashboardUserViewProps {
  resumen: ResumenRolesUsuario;
}

function DashboardUserView({ resumen }: DashboardUserViewProps) {
  const badgeRenter = obtenerInfoBadgeEstado(resumen.estadoRenter);
  const badgeOwner = obtenerInfoBadgeEstado(resumen.estadoOwner);

  return (
    <>
      <section className="onboarding-section">
        <div className="section-title-box">
          <h2>Activa tu cuenta en MotoRent</h2>
          <p>
            Elige cómo deseas operar dentro de la plataforma y completa tu
            verificación de identidad. Puedes habilitar uno o ambos perfiles.
          </p>
        </div>

        <div className="role-cards-grid">
          {/* TARJETA 1: ARRENDATARIO (RENTER) */}
          <article className="role-onboarding-card">
            <div className="role-card-top">
              <div className="icon-chip icon-chip--accent">
                <IconMoto size={20} />
              </div>
              <span
                className={`role-status-pill role-status-pill--${badgeRenter.variante}`}
              >
                {badgeRenter.texto}
              </span>
            </div>

            <h3>Alquilar motocicletas</h3>
            <p className="role-card-desc">
              Valida tu cédula, tu licencia de conducción (A1 o A2) y un
              comprobante de domicilio para reservar vehículos verificados.
            </p>

            {resumen.estadoRenter === "REJECTED" &&
              resumen.motivoRechazoRenter && (
                <div className="role-rejection-note">
                  <strong>Observación:</strong> {resumen.motivoRechazoRenter}
                </div>
              )}

            {resumen.estadoRenter === "PENDING" ? (
              <div className="role-pending-box">
                <IconClock size={16} />
                <span>
                  Tu solicitud de arrendatario está en revisión. Te avisaremos
                  en cuanto sea aprobada.
                </span>
              </div>
            ) : (
              <Link
                to="/verificar-renter"
                className="role-cta-button role-cta-button--accent"
              >
                {resumen.estadoRenter === "REJECTED"
                  ? "Corregir solicitud de arrendatario"
                  : "Verificarme como Arrendatario"}
              </Link>
            )}
          </article>

          {/* TARJETA 2: PROPIETARIO (OWNER) */}
          <article className="role-onboarding-card">
            <div className="role-card-top">
              <div className="icon-chip icon-chip--primary">
                <IconKey size={20} />
              </div>
              <span
                className={`role-status-pill role-status-pill--${badgeOwner.variante}`}
              >
                {badgeOwner.texto}
              </span>
            </div>

            <h3>Publicar mi motocicleta</h3>
            <p className="role-card-desc">
              Verifica tu identidad y residencia para publicar tus motocicletas
              y recibir el 85% neto de cada contrato completado.
            </p>

            {resumen.estadoOwner === "REJECTED" && resumen.motivoRechazoOwner && (
              <div className="role-rejection-note">
                <strong>Observación:</strong> {resumen.motivoRechazoOwner}
              </div>
            )}

            {resumen.estadoOwner === "PENDING" ? (
              <div className="role-pending-box">
                <IconClock size={16} />
                <span>
                  Tu solicitud de propietario está en revisión. Pronto podrás
                  publicar tus vehículos.
                </span>
              </div>
            ) : (
              <Link
                to="/verificar-owner"
                className="role-cta-button role-cta-button--primary"
              >
                {resumen.estadoOwner === "REJECTED"
                  ? "Corregir solicitud de propietario"
                  : "Verificarme como Propietario"}
              </Link>
            )}
          </article>
        </div>
      </section>

      <div className="section-title-box">
        <h2>Accesos disponibles</h2>
        <p>Puedes consultar el catálogo o revisar la información de tu cuenta</p>
      </div>

      <section className="quick-actions">
        <Link to="/motos" className="action-card">
          <div className="action-number">01</div>
          <h3>Explorar catálogo</h3>
          <p>
            Consulta las motocicletas disponibles, tarifas diarias y categorías
            activas en la plataforma.
          </p>
          <span className="action-link">Ver catálogo →</span>
        </Link>

        <Link to="/perfil" className="action-card">
          <div className="action-number">02</div>
          <h3>Revisar mi perfil</h3>
          <p>
            Verifica tu nombre completo, correo electrónico y teléfono
            registrados en MotoRent.
          </p>
          <span className="action-link">Ir a mi perfil →</span>
        </Link>
      </section>
    </>
  );
}

export default DashboardUserView;
