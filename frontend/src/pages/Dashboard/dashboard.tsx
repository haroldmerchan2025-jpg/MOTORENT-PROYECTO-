import "./Dashboard.css";
import { Link } from "react-router-dom";

const savedUser = localStorage.getItem("user");
const usuario = savedUser ? JSON.parse(savedUser) : null;
const nombre = usuario?.fullName ? usuario.fullName.split(" ")[0] : "";

<h1>¡Hola de nuevo{nombre ? `, ${nombre}` : ""}! 👋</h1>


// Simulación de una moto que el usuario tiene alquilada actualmente
const rentaActiva = {
  moto: "Yamaha MT-03",
  fechaDevolucion: "22 de septiembre de 2026",
  diasRestantes: 4,
  tarifaDiaria: 85000,
};

// Resumen de estadísticas del usuario (Cliente + Dueño)
const estadisticas = {
  rentasComoCliente: 3,        // Veces que ha alquilado motos para viajar
  motosPublicadas: 1,          // Motos que tiene puestas en renta
  gananciasDelMes: 340000,     // Dinero que ha ganado con su moto este mes (85% neto)
  proximaDevolucion: "22 sep", // Próxima fecha importante
};

function Dashboard() {

  return (
    <div className="dashboard">

      {/* ================================================================ */}
      {/* 3. CONTENIDO PRINCIPAL                                           */}
      {/* ================================================================ */}
      <main className="dashboard-content">
        
        {/* BANNER DE BIENVENIDA */}
        <section className="welcome-banner">
          <div>
            <span className="welcome-tag">PANEL DE CONTROL</span>
            <h1>¡Hola de nuevo! 👋</h1>
            <p className="welcome-description">
              Revisa tus alquileres activos, tus ganancias como propietario y el estado de tu cuenta.
            </p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4. BANNER DE RENTA ACTIVA (SI EL USUARIO TIENE UNA MOTO RENTADA) */}
        {/* ================================================================ */}
        {rentaActiva && (
          <section className="active-rental-banner">
            <div className="active-rental-icon">🏍️</div>
            <div className="active-rental-info">
              <div className="active-rental-badge">EN CURSO</div>
              <p className="active-rental-title">Tienes una {rentaActiva.moto} rentada</p>
              <p className="active-rental-text">
                Devolución programada: <strong>{rentaActiva.fechaDevolucion}</strong> ({rentaActiva.diasRestantes} días restantes).
              </p>
            </div>
            <Link to="/contrato" className="active-rental-button">
              Ver contrato y acta digital →
            </Link>
          </section>
        )}

        {/* ================================================================ */}
        {/* 5. TARJETAS DE ESTADÍSTICAS (MÉTRICAS DEL USUARIO)               */}
        {/* ================================================================ */}
        <section className="stats-row">
          {/* Métrica 1: Alquileres hechos como cliente */}
          <div className="stat-card">
            <span className="stat-icon">🛵</span>
            <p className="stat-number">{estadisticas.rentasComoCliente}</p>
            <p className="stat-label">Viajes realizados</p>
          </div>

          {/* Métrica 2: Motos que el usuario tiene publicadas (Dueño) */}
          <div className="stat-card">
            <span className="stat-icon">🔑</span>
            <p className="stat-number">{estadisticas.motosPublicadas}</p>
            <p className="stat-label">Motos publicadas</p>
          </div>

          {/* Métrica 3: Ganancias generadas en el mes (Dueño) */}
          <div className="stat-card highlight">
            <span className="stat-icon">💰</span>
            <p className="stat-number">${estadisticas.gananciasDelMes.toLocaleString("es-CO")}</p>
            <p className="stat-label">Ganancias este mes (COP)</p>
          </div>

          {/* Métrica 4: Próxima devolución */}
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <p className="stat-number">{estadisticas.proximaDevolucion}</p>
            <p className="stat-label">Próxima entrega</p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 6. BANNER DE PROPIETARIOS: INVITACIÓN A PUBLICAR MOTOS           */}
        {/* ================================================================ */}
        <section className="owner-promo-card">
          <div className="owner-promo-text">
            <h3>¿Quieres generar ingresos pasivos?</h3>
            <p>Pon tu moto en renta los días que no la uses. La plataforma te garantiza conductores verificados y pagos puntuales.</p>
          </div>
          <Link to="/publicarmoto" className="btn-promo-publish">
            Publicar mi moto gratis
          </Link>
        </section>

        {/* ================================================================ */}
        {/* 7. ACCIONES RÁPIDAS (ATRIBUTOS DE NAVEGACIÓN)                     */}
        {/* ================================================================ */}
        <div className="section-title-box">
          <h2>Acciones rápidas</h2>
          <p>Todo lo que puedes hacer en MotoRent</p>
        </div>

        <section className="quick-actions">
          {/* Acción 1: Ir al catálogo */}
          <Link to="/motos" className="action-card">
            <div className="action-number">01</div>
            <h3>Explorar catálogo</h3>
            <p>Descubre motocicletas de viaje, uso urbano o trabajo disponibles para hoy.</p>
            <span className="action-link">Ver catálogo →</span>
          </Link>

          {/* Acción 2: Publicar moto */}
          <Link to="/publicarmoto" className="action-card">
            <div className="action-number">02</div>
            <h3>Publicar mi moto</h3>
            <p>Sube tu moto con placa, fotos y define tu tarifa diaria para empezar a ganar.</p>
            <span className="action-link">Publicar moto →</span>
          </Link>

          {/* Acción 3: Ir a perfil */}
          <Link to="/perfil" className="action-card">
            <div className="action-number">03</div>
            <h3>Mi perfil y documentos</h3>
            <p>Verifica tu cédula, licencia de conducción y configura tu cuenta bancaria.</p>
            <span className="action-link">Administrar perfil →</span>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;