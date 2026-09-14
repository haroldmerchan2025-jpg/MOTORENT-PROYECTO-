import "./Dashboard.css";
import { useNavigate, Link } from "react-router-dom";

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
          <Link to="#rentas">Mis rentas</Link>
          <Link to="#perfil">Mi perfil</Link>
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

          <Link to="#rentas" className="action-card">
            <div className="action-number">02</div>
            <h3>Mis rentas</h3>
            <p>Revisa tus rentas activas, pasadas y las fechas de devolución.</p>
            <span className="action-link">Ver rentas →</span>
          </Link>

          <Link to="#perfil" className="action-card">
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