import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

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
          <a href="/dashboard">Inicio</a>
          <a href="#motos">Motos</a>
          <a href="#rentas">Mis rentas</a>
          <a href="#perfil">Mi perfil</a>
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

          <div className="action-card">
            <div className="action-number">01</div>
            <h3>Ver catálogo</h3>
            <p>Explora las motos disponibles para viaje, uso diario o trabajo.</p>
            <a href="#motos" className="action-link">Ver motos →</a>
          </div>

          <div className="action-card">
            <div className="action-number">02</div>
            <h3>Mis rentas</h3>
            <p>Revisa tus rentas activas, pasadas y las fechas de devolución.</p>
            <a href="#rentas" className="action-link">Ver rentas →</a>
          </div>

          <div className="action-card">
            <div className="action-number">03</div>
            <h3>Mi perfil</h3>
            <p>Actualiza tus datos, documentos y método de contacto.</p>
            <a href="#perfil" className="action-link">Ver perfil →</a>
          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;