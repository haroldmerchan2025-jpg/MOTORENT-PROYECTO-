import "./Rentas.css";
import { useNavigate, Link } from "react-router-dom";

// Datos de ejemplo — luego los traemos del backend real (modelo Rental)
const rentasEjemplo = [
  {
    id: 1,
    moto: "Yamaha MT-03",
    startDate: "2026-09-16",
    endDate: "2026-09-22",
    total: 510000,
    status: "ACTIVE",
  },
  {
    id: 2,
    moto: "Bajaj Pulsar NS160",
    startDate: "2026-08-01",
    endDate: "2026-08-05",
    total: 200000,
    status: "COMPLETED",
  },
  {
    id: 3,
    moto: "TVS Raider 125",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    total: 76000,
    status: "CANCELLED",
  },
];

const etiquetasEstado: Record<string, { texto: string; clase: string }> = {
  PENDING: { texto: "Pendiente", clase: "status-pending" },
  ACTIVE: { texto: "Activa", clase: "status-active" },
  COMPLETED: { texto: "Completada", clase: "status-completed" },
  CANCELLED: { texto: "Cancelada", clase: "status-cancelled" },
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Rentas() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    window.history.pushState(null, "", "/login");
    navigate("/login", { replace: true });
  }

  const rentaActiva = rentasEjemplo.find((r) => r.status === "ACTIVE");
  const historial = rentasEjemplo.filter((r) => r.status !== "ACTIVE");

  return (
    <div className="rentas-page">

      <header className="rentas-navbar">
        <div className="logo">
          <span>MOTO</span>RENT
        </div>

        <nav className="rentas-nav-links">
          <Link to="/dashboard">Inicio</Link>
          <Link to="/motos">Motos</Link>
          <Link to="/rentas">Mis rentas</Link>
          <Link to="/perfil">Mi perfil</Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="rentas-content">

        <h1>Mis rentas</h1>

        {rentaActiva && (
          <section className="rentas-card active-card">
            <span className={`status-badge ${etiquetasEstado[rentaActiva.status].clase}`}>
              {etiquetasEstado[rentaActiva.status].texto}
            </span>

            <h2>{rentaActiva.moto}</h2>

            <div className="rentas-dates">
              <div>
                <span className="rentas-date-label">Inicio</span>
                <span className="rentas-date-value">{formatearFecha(rentaActiva.startDate)}</span>
              </div>
              <div>
                <span className="rentas-date-label">Devolución</span>
                <span className="rentas-date-value">{formatearFecha(rentaActiva.endDate)}</span>
              </div>
              <div>
                <span className="rentas-date-label">Total</span>
                <span className="rentas-date-value">${rentaActiva.total.toLocaleString("es-CO")}</span>
              </div>
            </div>
          </section>
        )}

        <h3 className="rentas-subtitle">Historial</h3>

        {historial.length === 0 ? (
          <p className="rentas-empty">Todavía no tienes rentas anteriores.</p>
        ) : (
          <div className="rentas-list">
            {historial.map((renta) => (
              <div className="rentas-row" key={renta.id}>
                <div className="rentas-row-main">
                  <p className="rentas-row-moto">{renta.moto}</p>
                  <p className="rentas-row-fechas">
                    {formatearFecha(renta.startDate)} → {formatearFecha(renta.endDate)}
                  </p>
                </div>

                <span className={`status-badge ${etiquetasEstado[renta.status].clase}`}>
                  {etiquetasEstado[renta.status].texto}
                </span>

                <p className="rentas-row-total">${renta.total.toLocaleString("es-CO")}</p>
              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  );
}

export default Rentas;