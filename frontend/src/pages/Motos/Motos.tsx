import "./Motos.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ----------------------------------------------------------------------
// 1. DEFINICIÓN DEL TIPO DE DATO (TYPESCRIPT INTERFACE)
// Define qué propiedades tiene cada moto en el catálogo
// ----------------------------------------------------------------------
interface Moto {
  id: number;
  brand: string;
  model: string;
  year: number;
  displacement: number; // Cilindraje en cc
  dailyRate: number;    // Tarifa por día en pesos COP
  category: "Viaje" | "Uso diario" | "Trabajo";
  transmission: string; // Automática o Mecánica
  fuelType: string;     // Gasolina corriente, etc.
  soatValid: boolean;   // Si tiene SOAT vigente
  includesHelmet: boolean; // Si incluye casco
  description: string;  // Descripción detallada
}

// ----------------------------------------------------------------------
// 2. DATOS DE EJEMPLO (MOCK DATA)
// En el futuro, esto se reemplazará por la llamada a la API de tu backend
// ----------------------------------------------------------------------
const motosEjemplo: Moto[] = [
  {
    id: 1,
    brand: "Yamaha",
    model: "MT-03",
    year: 2023,
    displacement: 321,
    dailyRate: 85000,
    category: "Viaje",
    transmission: "Mecánica (6 velocidades)",
    fuelType: "Gasolina Extra",
    soatValid: true,
    includesHelmet: true,
    description: "Excelente para carretera y escapadas de fin de semana. Gran estabilidad, frenos ABS y máxima potencia en curvas."
  },
  {
    id: 2,
    brand: "Honda",
    model: "CB160F",
    year: 2024,
    displacement: 160,
    dailyRate: 45000,
    category: "Uso diario",
    transmission: "Mecánica (5 velocidades)",
    fuelType: "Gasolina Corriente",
    soatValid: true,
    includesHelmet: true,
    description: "La moto urbana perfecta. Muy bajo consumo de combustible, ágil entre el tráfico y postura de manejo cómoda."
  },
  {
    id: 3,
    brand: "AKT",
    model: "NKD 125",
    year: 2023,
    displacement: 125,
    dailyRate: 35000,
    category: "Trabajo",
    transmission: "Mecánica (5 velocidades)",
    fuelType: "Gasolina Corriente",
    soatValid: true,
    includesHelmet: true,
    description: "Económica y resistente. Diseñada para trabajar todo el día con el menor costo de combustible del mercado."
  },
  {
    id: 4,
    brand: "Suzuki",
    model: "V-Strom 250",
    year: 2022,
    displacement: 250,
    dailyRate: 95000,
    category: "Viaje",
    transmission: "Mecánica (6 velocidades)",
    fuelType: "Gasolina Corriente",
    soatValid: true,
    includesHelmet: true,
    description: "Comodidad total para viajes largos. Asiento acolchado, parabrisas alto y capacidad para instalar maletas laterales."
  },
  {
    id: 5,
    brand: "Bajaj",
    model: "Pulsar NS160",
    year: 2024,
    displacement: 160,
    dailyRate: 50000,
    category: "Uso diario",
    transmission: "Mecánica (5 velocidades)",
    fuelType: "Gasolina Corriente",
    soatValid: true,
    includesHelmet: true,
    description: "Diseño agresivo y deportivo para la ciudad. Motor de 4 válvulas con refrigeración por aceite y excelente respuesta."
  },
  {
    id: 6,
    brand: "TVS",
    model: "Raider 125",
    year: 2023,
    displacement: 125,
    dailyRate: 38000,
    category: "Trabajo",
    transmission: "Mecánica (5 velocidades)",
    fuelType: "Gasolina Corriente",
    soatValid: true,
    includesHelmet: true,
    description: "Moderna, tablero digital y modos de manejo Eco y Power. Ideal para mensajería con estilo."
  },
];

function Motos() {
  const navigate = useNavigate();

  // ----------------------------------------------------------------------
  // 3. ESTADOS DE BÚSQUEDA Y FILTROS
  // ----------------------------------------------------------------------
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  // ----------------------------------------------------------------------
  // 4. ESTADO DEL MODAL DE DETALLES Y RENTA
  // - motoSeleccionada: Guarda la moto a la que se le hizo clic para ver detalles
  // - fechaInicio y fechaFin: Fechas para calcular el costo total del alquiler
  // ----------------------------------------------------------------------
  const [motoSeleccionada, setMotoSeleccionada] = useState<Moto | null>(null);

  // Fechas por defecto: inicio mañana, fin pasado mañana (mínimo 1 día)
  const hoy = new Date().toISOString().split("T")[0];
  const [fechaInicio, setFechaInicio] = useState(hoy);
  const [fechaFin, setFechaFin] = useState(hoy);

  // Revisar si el usuario está autenticado
  const token = localStorage.getItem("token");
  const haySesion = token && token !== "undefined" && token !== "null";

  // Función para cerrar sesión
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  // ----------------------------------------------------------------------
  // 5. CÁLCULO DE DÍAS Y PRECIO TOTAL EN TIEMPO REAL
  // ----------------------------------------------------------------------
  const calcularDias = () => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaMs = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    return dias <= 0 ? 1 : dias; // Mínimo se cobra 1 día
  };

  const diasRenta = calcularDias();
  const precioTotal = (motoSeleccionada?.dailyRate || 0) * diasRenta;

  // ----------------------------------------------------------------------
  // 6. FILTRADO DE MOTOS
  // ----------------------------------------------------------------------
  const motosFiltradas = motosEjemplo.filter((moto) => {
    const coincideBusqueda = `${moto.brand} ${moto.model}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "Todas" || moto.category === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="motos-page">
      {/* ================================================================ */}
      {/* NAVBAR SUPERIOR                                                  */}
      {/* ================================================================ */}
      <header className="motos-navbar">
        <Link to="/" className="logo">
          <span>MOTO</span>RENT
        </Link>

        {/* Barra de búsqueda interactiva */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por marca o modelo (ej. Yamaha, Pulsar)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Menú según sesión */}
        {haySesion ? (
          <div className="user-nav">
            <nav className="motos-nav-links">
              <Link to="/dashboard">Mi Panel</Link>
              <Link to="/perfil">Mi Perfil</Link>
            </nav>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="guest-nav-buttons">
            <Link to="/login" className="btn-login-nav">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-register-nav">
              Registrarse
            </Link>
          </div>
        )}
      </header>

      {/* ================================================================ */}
      {/* CONTENIDO PRINCIPAL DEL CATÁLOGO                                */}
      {/* ================================================================ */}
      <main className="motos-content">
        <div className="motos-heading">
          <div>
            <h1>Catálogo de Motocicletas</h1>
            <p>Elige tu moto ideal y resérvala con entrega inmediata</p>
          </div>
          <span className="count-badge">{motosFiltradas.length} motos encontradas</span>
        </div>

        {/* Botones de filtro de categorías */}
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

        {/* Cuadrícula de tarjetas de motos */}
        <div className="motos-grid">
          {motosFiltradas.map((moto) => (
            <div className="moto-card" key={moto.id}>
              {/* Espacio para la imagen de la moto */}
              <div className="moto-image-placeholder">
                <span className="category-badge">{moto.category}</span>
                <span className="displacement-badge">{moto.displacement} cc</span>
              </div>

              <div className="moto-card-body">
                <h3>{moto.brand} {moto.model}</h3>
                <p className="moto-specs">Año {moto.year} • {moto.transmission}</p>

                <div className="moto-card-footer">
                  <div className="moto-price-box">
                    <span className="price-label">Tarifa diaria</span>
                    <span className="moto-price">
                      ${moto.dailyRate.toLocaleString("es-CO")}
                      <span className="day-text">/día</span>
                    </span>
                  </div>

                  {/* ESTE BOTÓN ABRE EL MODAL DE DETALLES Y RENTA */}
                  <button
                    className="rent-button"
                    onClick={() => setMotoSeleccionada(moto)}
                  >
                    Rentar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {motosFiltradas.length === 0 && (
          <div className="no-results-box">
            <p className="no-results">No se encontraron motos con esa búsqueda.</p>
            <button className="reset-filter-btn" onClick={() => { setBusqueda(""); setCategoria("Todas"); }}>
              Ver todas las motos
            </button>
          </div>
        )}
      </main>

      {/* ================================================================ */}
      {/* MODAL DE DETALLES DE LA MOTO Y CALCULADORA DE RENTA               */}
      {/* Se abre únicamente cuando hay una motoSeleccionada                */}
      {/* ================================================================ */}
      {motoSeleccionada && (
        <div className="modal-overlay" onClick={() => setMotoSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Botón para cerrar (X) */}
            <button className="modal-close" onClick={() => setMotoSeleccionada(null)}>
              ✕
            </button>

            {/* Cabecera del modal */}
            <div className="modal-header">
              <span className="modal-category">{motoSeleccionada.category}</span>
              <h2>{motoSeleccionada.brand} {motoSeleccionada.model} ({motoSeleccionada.year})</h2>
              <p className="modal-description">{motoSeleccionada.description}</p>
            </div>

            <div className="modal-body-grid">
              {/* COLUMNA IZQUIERDA: Especificaciones técnicas */}
              <div className="modal-specs-section">
                <h3>Ficha técnica y beneficios</h3>
                <div className="specs-list">
                  <div className="spec-row">
                    <span className="spec-name">🏍️ Cilindraje:</span>
                    <strong>{motoSeleccionada.displacement} cc</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">⚙️ Transmisión:</span>
                    <strong>{motoSeleccionada.transmission}</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">⛽ Combustible:</span>
                    <strong>{motoSeleccionada.fuelType}</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">🛡️ Documentos:</span>
                    <strong className="badge-valid">SOAT y Tecno al día</strong>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: Calculadora de fechas y reserva */}
              <div className="modal-rental-calculator">
                <h3>Calcula tu alquiler</h3>

                <div className="date-inputs">
                  <div className="input-group">
                    <label>Fecha de recogida:</label>
                    <input
                      type="date"
                      min={hoy}
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Fecha de devolución:</label>
                    <input
                      type="date"
                      min={fechaInicio}
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </div>
                </div>

                {/* Resumen del valor a pagar */}
                <div className="cost-summary">
                  <div className="summary-row">
                    <span>Días seleccionados:</span>
                    <strong>{diasRenta} {diasRenta === 1 ? "día" : "días"}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Tarifa diaria:</span>
                    <span>${motoSeleccionada.dailyRate.toLocaleString("es-CO")} COP</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total a pagar:</span>
                    <strong className="total-amount">${precioTotal.toLocaleString("es-CO")} COP</strong>
                  </div>
                </div>

                {/* Botón de confirmación o de iniciar sesión */}
                {haySesion ? (
                  <button
                    className="btn-confirm-rental"
                    onClick={() => {
                      alert(`¡Solicitud enviada para la ${motoSeleccionada.brand} ${motoSeleccionada.model} por ${diasRenta} días! Total: $${precioTotal.toLocaleString("es-CO")} COP.`);
                      setMotoSeleccionada(null);
                    }}
                  >
                    Confirmar y Solicitar Renta
                  </button>
                ) : (
                  <div className="guest-modal-action">
                    <p>Debes iniciar sesión para completar la reserva</p>
                    <Link to="/login" className="btn-modal-login">
                      Iniciar sesión para reservar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Motos;