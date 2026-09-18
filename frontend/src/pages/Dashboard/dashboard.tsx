import "./Dashboard.css";
import { useNavigate, Link } from "react-router-dom";

// Datos de ejemplo — luego los conectamos a tu backend real (Rental)
const rentaActiva = {
  moto: "Yamaha MT-03",
  fechaDevolucion: "22 de septiembre de 2026",
  diasRestantes: 6,
};

const estadisticas = {
  rentasTotales: 4,
  motoFavorita: "Yamaha MT-03",
  proximaDevolucion: "22 sep",
};

function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    window.history.pushState(null, "", "/login");
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard">

      <header className="dashboard-navbar">
        <div className="logo">
          <span>MOTO</span>RENT
        </div>

        <nav className="dashboard-nav-links">
          <Link to="/dashboard">Inicio</Link>
          <Link to="/motos">Motos</Link>
          <Link to="/rentas">Mis rentas</Link>
          <Link to="/perfil">Mi perfil</Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="dashboard-content">

        <section className="welcome-banner">
          <div>
            <p className="welcome-tag">PANEL DE USUARIO</p>
            <h1>Bienvenido de nuevo</h1>
            <p className="welcome-description">
              Aquí puedes ver el catálogo de motos, tus rentas activas y el estado de tu cuenta.
            </p>
          </div>
        </section>

        {rentaActiva && (
          <section className="active-rental-banner">
            <div className="active-rental-icon">🏍</div>
            <div className="active-rental-info">
              <p className="active-rental-title">Tienes una moto rentada</p>
              <p className="active-rental-text">
                {rentaActiva.moto} · devolución el {rentaActiva.fechaDevolucion}
                {" "}({rentaActiva.diasRestantes} días restantes)
              </p>
            </div>
            <Link to="#rentas" className="active-rental-button">Ver detalles</Link>
          </section>
        )}

        <section className="stats-row">
          <div className="stat-card">
            <p className="stat-number">{estadisticas.rentasTotales}</p>
            <p className="stat-label">Rentas totales</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{estadisticas.motoFavorita}</p>
            <p className="stat-label">Moto favorita</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{estadisticas.proximaDevolucion}</p>
            <p className="stat-label">Próxima devolución</p>
          </div>
        </section>

        <section className="verification-banner">
          <div className="verification-icon">!</div>
          <div>
            <p className="verification-title">Verificación pendiente</p>
            <p className="verification-text">
              Sube tu documento y licencia para poder rentar una moto.
            </p>
          </div>
          <button className="verification-button">Verificar ahora</button>
        </section>

        <section className="quick-actions">

          <Link to="/motos" className="action-card">
            <div className="action-number">01</div>
            <h3>Ver catálogo</h3>
            <p>Explora las motos disponibles para viaje, uso diario o trabajo.</p>
            <span className="action-link">Ver motos →</span>
          </Link>

          <Link to="/rentas" className="active-rental-button">Ver detalles
            <div className="action-number">02</div>
            <h3>Mis rentas</h3>
            <p>Revisa tus rentas activas, pasadas y las fechas de devolución.</p>
            <span className="action-link">Ver rentas →</span>
          </Link>

          <Link to="/perfil" className="action-card"> 
            <div className="action-number">03</div>
            <h3>Mi perfil</h3>
            <p>Actualiza tus datos, documentos y método de contacto.</p>
            <span className="action-link">Ver perfil →</span>
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;