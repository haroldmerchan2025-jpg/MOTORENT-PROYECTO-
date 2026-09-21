// frontend/src/pages/Motos/Motos.tsx
import "./Motos.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Moto {
  id: number | string;
  brand: string;
  model: string;
  year: number;
  displacement: number | string;
  dailyRate: number | string;
  licensePlate?: string;
  color?: string;
  category?: string;
  KM?: number;
  description?: string;
}

// Motos de muestra en caso de que el backend esté apagado
const motosRespaldo: Moto[] = [
  {
    id: "ejemplo-1",
    brand: "Yamaha",
    model: "MT-03",
    year: 2023,
    displacement: 321,
    dailyRate: 85000,
    licensePlate: "KTM45G",
    category: "Viaje",
    description: "Excelente para carretera y escapadas de fin de semana. Gran estabilidad y frenos ABS.",
  },
  {
    id: "ejemplo-2",
    brand: "Honda",
    model: "CB160F",
    year: 2024,
    displacement: 160,
    dailyRate: 45000,
    licensePlate: "HND16B",
    category: "Uso diario",
    description: "La moto urbana perfecta. Muy bajo consumo de combustible y ágil entre el tráfico.",
  },
];

function Motos() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [motoSeleccionada, setMotoSeleccionada] = useState<Moto | null>(null);

  const hoy = new Date().toISOString().split("T")[0];
  const [fechaInicio, setFechaInicio] = useState(hoy);
  const [fechaFin, setFechaFin] = useState(hoy);

  const token = localStorage.getItem("token");
  const haySesion = token && token !== "undefined" && token !== "null";

  // 1. CARGAR MOTOS REALES DESDE EL BACKEND
  useEffect(() => {
    fetch("http://localhost:3000/api/motos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Asignamos una categoría por defecto si en la DB no viene
          const motosFormateadas = data.map((m: any) => ({
            ...m,
            category: m.category || (Number(m.displacement) >= 250 ? "Viaje" : "Uso diario"),
            description: m.description || `Moto ${m.brand} ${m.model} año ${m.year} en excelente estado mecánico.`,
          }));
          setMotos(motosFormateadas);
        } else {
          // Si la DB está vacía, mostramos las de respaldo
          setMotos(motosRespaldo);
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar motos del backend:", err);
        setMotos(motosRespaldo);
        setCargando(false);
      });
  }, []);

  const calcularDias = () => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaMs = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    return dias <= 0 ? 1 : dias;
  };

  const diasRenta = calcularDias();
  const tarifaNumero = Number(motoSeleccionada?.dailyRate) || 0;
  const precioTotal = tarifaNumero * diasRenta;

  // Filtrado por búsqueda y categoría
  const motosFiltradas = motos.filter((moto) => {
    const coincideBusqueda = `${moto.brand} ${moto.model} ${moto.licensePlate || ""}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const cat = moto.category || "Uso diario";
    const coincideCategoria = categoria === "Todas" || cat === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="motos-page">
      <main className="motos-content">
        <div className="motos-heading">
          <div>
            <h1>Catálogo de Motocicletas</h1>
            <p>Elige tu moto ideal y resérvala con entrega inmediata</p>
          </div>
          <span className="count-badge">
            {cargando ? "Cargando..." : `${motosFiltradas.length} motos disponibles`}
          </span>
        </div>

        {/* Buscador y Filtros */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por marca, modelo o placa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "10px 16px",
              borderRadius: "20px",
              border: "1.5px solid #CBD5E0",
              outline: "none",
              fontSize: "14px",
            }}
          />
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

        {/* Listado de Tarjetas */}
        {cargando ? (
          <p style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            Consultando motocicletas en la base de datos...
          </p>
        ) : (
          <div className="motos-grid">
            {motosFiltradas.map((moto) => {
              // Buscar foto guardada en el navegador para esta placa
              const fotoLocal = moto.licensePlate
                ? localStorage.getItem(`foto_moto_${moto.licensePlate.toUpperCase()}`)
                : null;

              return (
                <div className="moto-card" key={moto.id}>
                  <div
                    className="moto-image-placeholder"
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    {fotoLocal ? (
                      <img
                        src={fotoLocal}
                        alt={`${moto.brand} ${moto.model}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : null}

                    <span
                      className="category-badge"
                      style={{ position: "relative", zIndex: 2 }}
                    >
                      {moto.category || "Uso diario"}
                    </span>
                    <span
                      className="displacement-badge"
                      style={{ position: "relative", zIndex: 2 }}
                    >
                      {moto.displacement} cc
                    </span>
                  </div>

                  <div className="moto-card-body">
                    <h3>
                      {moto.brand} {moto.model}
                    </h3>
                    <p className="moto-specs">
                      Año {moto.year} {moto.licensePlate && `• Placa: ${moto.licensePlate}`}
                    </p>

                    <div className="moto-card-footer">
                      <div className="moto-price-box">
                        <span className="price-label">Tarifa diaria</span>
                        <span className="moto-price">
                          ${Number(moto.dailyRate).toLocaleString("es-CO")}
                          <span className="day-text">/día</span>
                        </span>
                      </div>

                      <button
                        className="rent-button"
                        onClick={() => setMotoSeleccionada(moto)}
                      >
                        Rentar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!cargando && motosFiltradas.length === 0 && (
          <div className="no-results-box">
            <p className="no-results">No se encontraron motos con esa búsqueda.</p>
            <button
              className="reset-filter-btn"
              onClick={() => {
                setBusqueda("");
                setCategoria("Todas");
              }}
            >
              Ver todas las motos
            </button>
          </div>
        )}
      </main>

      {/* Modal de Detalle */}
      {motoSeleccionada && (
        <div className="modal-overlay" onClick={() => setMotoSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setMotoSeleccionada(null)}>
              ✕
            </button>

            <div className="modal-header">
              <span className="modal-category">
                {motoSeleccionada.category || "Uso diario"}
              </span>
              <h2>
                {motoSeleccionada.brand} {motoSeleccionada.model} ({motoSeleccionada.year})
              </h2>
              <p className="modal-description">{motoSeleccionada.description}</p>
            </div>

            <div className="modal-body-grid">
              <div className="modal-specs-section">
                <h3>Ficha técnica y beneficios</h3>
                <div className="specs-list">
                  <div className="spec-row">
                    <span className="spec-name">🏍️ Cilindraje:</span>
                    <strong>{motoSeleccionada.displacement} cc</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">📄 Placa:</span>
                    <strong>{motoSeleccionada.licensePlate || "Verificada"}</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">🛡️ Documentos:</span>
                    <strong className="badge-valid">SOAT y Tecno al día</strong>
                  </div>
                </div>
              </div>

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

                <div className="cost-summary">
                  <div className="summary-row">
                    <span>Días seleccionados:</span>
                    <strong>{diasRenta} {diasRenta === 1 ? "día" : "días"}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Tarifa diaria:</span>
                    <span>${tarifaNumero.toLocaleString("es-CO")} COP</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total a pagar:</span>
                    <strong className="total-amount">${precioTotal.toLocaleString("es-CO")} COP</strong>
                  </div>
                </div>

                {haySesion ? (
                  <button
                    className="btn-confirm-rental"
                    onClick={() => {
                      alert(`¡Solicitud enviada para la ${motoSeleccionada.brand} ${motoSeleccionada.model}!`);
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