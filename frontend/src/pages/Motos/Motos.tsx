import "./Motos.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const motosEjemplo = [
  { id: 1, brand: "Yamaha", model: "MT-03", year: 2023, displacement: 321, dailyRate: 85000, category: "Viaje" },
  { id: 2, brand: "Honda", model: "CB160F", year: 2024, displacement: 160, dailyRate: 45000, category: "Uso diario" },
  { id: 3, brand: "AKT", model: "NKD 125", year: 2023, displacement: 125, dailyRate: 35000, category: "Trabajo" },
  { id: 4, brand: "Suzuki", model: "V-Strom 250", year: 2022, displacement: 250, dailyRate: 95000, category: "Viaje" },
  { id: 5, brand: "Bajaj", model: "Pulsar NS160", year: 2024, displacement: 160, dailyRate: 50000, category: "Uso diario" },
  { id: 6, brand: "TVS", model: "Raider 125", year: 2023, displacement: 125, dailyRate: 38000, category: "Trabajo" },
];

function Motos() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  // Revisa si hay una sesión activa (mismo criterio que ProtectedRoute)
  const token = localStorage.getItem("token");
  const haySesion = token && token !== "undefined" && token !== "null";

  function handleLogout() {
    localStorage.removeItem("token");
    window.history.pushState(null, "", "/login");
    navigate("/login", { replace: true });
  }

  const motosFiltradas = motosEjemplo.filter((moto) => {
    const coincideBusqueda = `${moto.brand} ${moto.model}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "Todas" || moto.category === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="motos-page">

      <header className="motos-navbar">
        <div className="logo">
          <span>MOTO</span>RENT
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {haySesion ? (
          <>
            <nav className="motos-nav-links">
              <Link to="/dashboard">Inicio</Link>
              <Link to="#rentas">Mis rentas</Link>
              <Link to="#perfil">Mi perfil</Link>
            </nav>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className="guest-nav-buttons">
            <Link to="/login" className="btn-login">Iniciar sesión</Link>
            <Link to="/register" className="btn-register">Registrarse</Link>
          </div>
        )}
      </header>

      <main className="motos-content">

        <div className="motos-heading">
          <h1>Catálogo de motos</h1>
          <p>{motosFiltradas.length} motos disponibles</p>
        </div>

        <div className="category-filters">
          {["Todas", "Viaje", "Uso diario", "Trabajo"].map((cat) => (
            <button
              key={cat}
              className={categoria === cat ? "filter-chip active" : "filter-chip"}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="motos-grid">
          {motosFiltradas.map((moto) => (
            <div className="moto-card" key={moto.id}>
              <div className="moto-image-placeholder"></div>

              <div className="moto-card-body">
                <span className="moto-category-tag">{moto.category}</span>
                <h3>{moto.brand} {moto.model}</h3>
                <p className="moto-specs">{moto.year} · {moto.displacement}cc</p>

                <div className="moto-card-footer">
                  <span className="moto-price">
                    ${moto.dailyRate.toLocaleString("es-CO")} <span>/día</span>
                  </span>

                  {haySesion ? (
                    <button className="rent-button">Rentar</button>
                  ) : (
                    <Link to="/login" className="rent-button rent-button-guest">
                      Inicia sesión
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {motosFiltradas.length === 0 && (
          <p className="no-results">No encontramos motos con esa búsqueda.</p>
        )}

      </main>

    </div>
  );
}

export default Motos;