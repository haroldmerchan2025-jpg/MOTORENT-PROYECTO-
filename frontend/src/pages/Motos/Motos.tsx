// frontend/src/pages/Motos/Motos.tsx
import "./Motos.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import motoDefaultImg from "../../assets/imagenes/moto1.jpeg";

interface MotoOwner {
  id?: string;
  estadoVerificacion?: string;
  user?: {
    fullName?: string;
  };
}

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
  status?: string;
  description?: string;
  owner?: MotoOwner | null;
}

type RangoCC = "todos" | "a1" | "medio" | "alto";
type OrdenCatalogo = "relevancia" | "precio_asc" | "precio_desc" | "cc_desc" | "reciente";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const motosRespaldo: Moto[] = [
  {
    id: "ejemplo-1",
    brand: "Yamaha",
    model: "MT-03",
    year: 2024,
    displacement: 321,
    dailyRate: 85000,
    licensePlate: "KTM45G",
    color: "Negro Mate",
    KM: 4200,
    category: "Viaje",
    status: "AVAILABLE",
    description:
      "Excelente para carretera y escapadas de fin de semana. Gran estabilidad y frenos ABS.",
  },
  {
    id: "ejemplo-2",
    brand: "Honda",
    model: "CB160F",
    year: 2025,
    displacement: 160,
    dailyRate: 45000,
    licensePlate: "HND16B",
    color: "Blanco Perla",
    KM: 2700,
    category: "Uso diario",
    status: "AVAILABLE",
    description:
      "Moto urbana ágil, económica en consumo de combustible y muy cómoda para trayectos diarios.",
  },
];

function obtenerCC(valor: number | string | undefined): number {
  const numero = Number(String(valor ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numero) ? numero : 0;
}

function obtenerCategoriaMoto(moto: Moto): string {
  if (moto.category) return moto.category;
  const cc = obtenerCC(moto.displacement);
  if (cc >= 300) return "Viaje";
  if (cc <= 125) return "Trabajo";
  return "Uso diario";
}

function obtenerLicencia(cc: number): "A1" | "A2" {
  return cc > 0 && cc <= 125 ? "A1" : "A2";
}

function obtenerTipoUso(categoria: string): string {
  if (categoria === "Viaje") return "Carretera";
  if (categoria === "Trabajo") return "Trabajo";
  return "Urbana";
}

function obtenerEstadoKm(km?: number): string {
  if (typeof km !== "number") return "Excelente estado";
  if (km <= 5000) return "Prácticamente nueva";
  if (km <= 20000) return "Muy buen estado";
  return "Mantenimiento al día";
}

function formatearFechaISO(offsetDias = 0): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + offsetDias);
  return fecha.toISOString().split("T")[0];
}

/* Íconos SVG minimalistas */
const svgProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const IconSearch = () => (
  <svg {...svgProps} width={17} height={17}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconSliders = () => (
  <svg {...svgProps} width={16} height={16}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const IconShieldCheck = () => (
  <svg {...svgProps} width={13} height={13}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconGauge = () => (
  <svg {...svgProps} width={14} height={14}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

const IconBolt = () => (
  <svg {...svgProps} width={14} height={14}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconCalendar = () => (
  <svg {...svgProps} width={14} height={14}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconPalette = () => (
  <svg {...svgProps} width={14} height={14}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="9.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="9.5" cy="14.5" r="1" fill="currentColor" />
  </svg>
);

const IconCheckCircle = () => (
  <svg {...svgProps} width={15} height={15}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconUser = () => (
  <svg {...svgProps} width={18} height={18}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCamera = () => (
  <svg {...svgProps} width={14} height={14}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconInfo = () => (
  <svg {...svgProps} width={15} height={15}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

function Motos() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros sencillos del catálogo
  const [busqueda, setBusqueda] = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [categoria, setCategoria] = useState("Todas");
  const [rangoCC, setRangoCC] = useState<RangoCC>("todos");
  const [cilindrajeBuscado, setCilindrajeBuscado] = useState("");
  const [orden, setOrden] = useState<OrdenCatalogo>("relevancia");

  // Modal de detalle y cálculo de reserva
  const [motoSeleccionada, setMotoSeleccionada] = useState<Moto | null>(null);
  const hoy = formatearFechaISO(0);
  const manana = formatearFechaISO(1);
  const [fechaInicio, setFechaInicio] = useState(hoy);
  const [fechaFin, setFechaFin] = useState(manana);
  const [enviandoRenta, setEnviandoRenta] = useState(false);
  const [mensajeRenta, setMensajeRenta] = useState<{
    tipo: "ok" | "error";
    texto: string;
    necesitaPerfil?: boolean;
  } | null>(null);

  const token = localStorage.getItem("token");
  const haySesion = Boolean(token && token !== "undefined" && token !== "null");

  useEffect(() => {
    fetch(`${API_URL}/api/motos`)
      .then((res) => res.json())
      .then((resJson) => {
        const lista = Array.isArray(resJson)
          ? resJson
          : Array.isArray(resJson?.data)
          ? resJson.data
          : [];

        if (lista.length > 0) {
          const motosFormateadas = lista.map((m: Moto) => ({
            ...m,
            category: obtenerCategoriaMoto(m),
            description:
              m.description ||
              `Motocicleta ${m.brand} ${m.model} modelo ${m.year}, lista para rodar con documentos al día y revisión mecánica verificada.`,
          }));
          setMotos(motosFormateadas);
        } else {
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

  // Cierra el modal con Escape
  useEffect(() => {
    if (!motoSeleccionada) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMotoSeleccionada(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [motoSeleccionada]);

  const abrirModalMoto = (moto: Moto) => {
    setMotoSeleccionada(moto);
    setFechaInicio(hoy);
    setFechaFin(manana);
    setMensajeRenta(null);
  };

  // Filtrado y ordenamiento sencillo
  const { motosFiltradas, usandoCercanasCC } = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const ccObjetivo = Number(cilindrajeBuscado.trim());
    const tieneCCObjetivo = cilindrajeBuscado.trim() !== "" && Number.isFinite(ccObjetivo) && ccObjetivo > 0;

    const base = motos.filter((moto) => {
      const cat = obtenerCategoriaMoto(moto);
      const cc = obtenerCC(moto.displacement);

      const coincideTexto =
        !q ||
        `${moto.brand} ${moto.model} ${moto.color || ""} ${moto.licensePlate || ""} ${moto.year}`
          .toLowerCase()
          .includes(q);

      const coincideCategoria = categoria === "Todas" || cat === categoria;

      let coincideRango = true;
      if (rangoCC === "a1") coincideRango = cc > 0 && cc <= 125;
      if (rangoCC === "medio") coincideRango = cc > 125 && cc <= 250;
      if (rangoCC === "alto") coincideRango = cc > 250;

      return coincideTexto && coincideCategoria && coincideRango;
    });

    let resultado = [...base];
    let cercanas = false;

    if (tieneCCObjetivo) {
      const exactasOCercanas = base.filter(
        (m) => Math.abs(obtenerCC(m.displacement) - ccObjetivo) <= 50
      );
      if (exactasOCercanas.length > 0) {
        resultado = exactasOCercanas.sort(
          (a, b) =>
            Math.abs(obtenerCC(a.displacement) - ccObjetivo) -
            Math.abs(obtenerCC(b.displacement) - ccObjetivo)
        );
      } else if (base.length > 0) {
        cercanas = true;
        resultado = [...base].sort(
          (a, b) =>
            Math.abs(obtenerCC(a.displacement) - ccObjetivo) -
            Math.abs(obtenerCC(b.displacement) - ccObjetivo)
        );
      }
    }

    if (orden === "precio_asc") {
      resultado.sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate));
    } else if (orden === "precio_desc") {
      resultado.sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate));
    } else if (orden === "cc_desc") {
      resultado.sort((a, b) => obtenerCC(b.displacement) - obtenerCC(a.displacement));
    } else if (orden === "reciente") {
      resultado.sort((a, b) => Number(b.year) - Number(a.year));
    }

    return { motosFiltradas: resultado, usandoCercanasCC: cercanas };
  }, [motos, busqueda, categoria, rangoCC, cilindrajeBuscado, orden]);

  const cantidadFiltrosActivos =
    (categoria !== "Todas" ? 1 : 0) +
    (rangoCC !== "todos" ? 1 : 0) +
    (cilindrajeBuscado.trim() !== "" ? 1 : 0) +
    (orden !== "relevancia" ? 1 : 0);

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoria("Todas");
    setRangoCC("todos");
    setCilindrajeBuscado("");
    setOrden("relevancia");
  };

  // Cálculo de días y precio en el modal
  const calcularDias = () => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaMs = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    return Number.isFinite(dias) && dias > 0 ? dias : 1;
  };

  const diasRenta = calcularDias();
  const tarifaNumero = Number(motoSeleccionada?.dailyRate) || 0;
  const precioTotal = tarifaNumero * diasRenta;

  const obtenerFotoMoto = (moto: Moto): string => {
    const fotoLocal = moto.licensePlate
      ? localStorage.getItem(`foto_moto_${moto.licensePlate.toUpperCase()}`)
      : null;
    return fotoLocal || motoDefaultImg;
  };

  const handleSolicitarRenta = async () => {
    if (!motoSeleccionada || !token) return;

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setMensajeRenta({
        tipo: "error",
        texto: "La fecha de devolución debe ser posterior a la fecha de recogida.",
      });
      return;
    }

    setEnviandoRenta(true);
    setMensajeRenta(null);

    try {
      const response = await fetch(`${API_URL}/api/rentas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          motoId: motoSeleccionada.id,
          startDate: new Date(`${fechaInicio}T08:00:00`).toISOString(),
          endDate: new Date(`${fechaFin}T08:00:00`).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || data.mensaje || "No se pudo crear la solicitud de renta.";
        setMensajeRenta({
          tipo: "error",
          texto: msg,
          necesitaPerfil: response.status === 403,
        });
        setEnviandoRenta(false);
        return;
      }

      setMensajeRenta({
        tipo: "ok",
        texto: `Solicitud enviada para la ${motoSeleccionada.brand} ${motoSeleccionada.model}.`,
      });
    } catch {
      setMensajeRenta({
        tipo: "error",
        texto: "No fue posible conectar con el servidor. Verifica que el backend esté encendido.",
      });
    } finally {
      setEnviandoRenta(false);
    }
  };

  const ccModal = motoSeleccionada ? obtenerCC(motoSeleccionada.displacement) : 0;
  const categoriaModal = motoSeleccionada ? obtenerCategoriaMoto(motoSeleccionada) : "Uso diario";
  const licenciaModal = obtenerLicencia(ccModal);
  const nombrePropietario =
    motoSeleccionada?.owner?.user?.fullName || "Flota MotoRent";

  return (
    <div className="motos-page">
      <main className="motos-content">
        {/* Encabezado principal */}
        <div className="motos-heading">
          <div>
            <h1>Catálogo de Motocicletas</h1>
            <p>
              Compara las especificaciones clave, filtra por cilindraje y abre cualquier motocicleta
              para ver sus detalles.
            </p>
          </div>
          <span className="count-badge">
            {cargando
              ? "Cargando..."
              : `Mostrando ${motosFiltradas.length} de ${motos.length}`}
          </span>
        </div>

        {/* Barra de búsqueda y panel de filtros */}
        <section className="motos-toolbar" aria-label="Filtros del catálogo">
          <div className="motos-search-bar-row">
            <div className="motos-search-field">
              <IconSearch />
              <input
                type="text"
                placeholder="Buscar por marca, modelo, color o placa..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <button
              type="button"
              className={`motos-filter-toggle ${filtrosAbiertos ? "active" : ""}`}
              onClick={() => setFiltrosAbiertos((prev) => !prev)}
            >
              <IconSliders />
              <span>Filtros</span>
              {cantidadFiltrosActivos > 0 && (
                <span className="motos-filter-count">{cantidadFiltrosActivos}</span>
              )}
            </button>
          </div>

          {filtrosAbiertos && (
            <div className="motos-filters-drawer">
              <div className="motos-drawer-grid">
                <label className="motos-cc-field">
                  <span>Cilindraje exacto o cercano (cc)</span>
                  <input
                    type="number"
                    min={50}
                    max={1500}
                    placeholder="Ej. 200"
                    value={cilindrajeBuscado}
                    onChange={(e) => setCilindrajeBuscado(e.target.value)}
                  />
                </label>

                <label className="motos-select-field">
                  <span>Ordenar por</span>
                  <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value as OrdenCatalogo)}
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="precio_asc">Menor precio</option>
                    <option value="precio_desc">Mayor precio</option>
                    <option value="cc_desc">Mayor cilindraje</option>
                    <option value="reciente">Modelo más reciente</option>
                  </select>
                </label>
              </div>

              <div className="motos-chips-row">
                <div className="category-filters">
                  {["Todas", "Viaje", "Uso diario", "Trabajo"].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      className={categoria === cat ? "filter-chip active" : "filter-chip"}
                      onClick={() => setCategoria(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="motos-cc-chips">
                  <span className="motos-cc-chips-label">Rangos:</span>
                  {[
                    { id: "todos", label: "Todos los cc" },
                    { id: "a1", label: "Hasta 125 cc (A1)" },
                    { id: "medio", label: "150 – 250 cc" },
                    { id: "alto", label: "300+ cc" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={`filter-chip filter-chip--sm ${
                        rangoCC === item.id ? "active" : ""
                      }`}
                      onClick={() => setRangoCC(item.id as RangoCC)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="motos-drawer-footer">
                {(cantidadFiltrosActivos > 0 || busqueda.trim() !== "") && (
                  <button type="button" className="motos-clear-all" onClick={limpiarFiltros}>
                    Limpiar filtros
                  </button>
                )}
                <button
                  type="button"
                  className="motos-drawer-done"
                  onClick={() => setFiltrosAbiertos(false)}
                >
                  Ver resultados ({motosFiltradas.length})
                </button>
              </div>
            </div>
          )}
        </section>

        {usandoCercanasCC && (
          <div className="motos-nearest-banner">
            <IconInfo />
            <span>
              No encontramos una moto exacta de {cilindrajeBuscado} cc. Te mostramos las opciones
              más cercanas en cilindraje.
            </span>
          </div>
        )}

        {/* Cuadrícula de motocicletas */}
        {cargando ? (
          <p className="motos-loading-text">Consultando motocicletas disponibles...</p>
        ) : (
          <div className="motos-grid">
            {motosFiltradas.map((moto) => {
              const cc = obtenerCC(moto.displacement);
              const cat = obtenerCategoriaMoto(moto);
              const licencia = obtenerLicencia(cc);

              return (
                <article
                  className="moto-card"
                  key={moto.id}
                  onClick={() => abrirModalMoto(moto)}
                >
                  <div className="moto-card-media">
                    <img
                      src={obtenerFotoMoto(moto)}
                      alt={`${moto.brand} ${moto.model}`}
                      className="moto-card-img"
                    />
                    <span className="card-pill-left">{cat}</span>
                    <span className="card-pill-right">
                      <IconShieldCheck />
                      Verificada
                    </span>
                  </div>

                  <div className="moto-card-body">
                    <div className="moto-title-row">
                      <h3>
                        {moto.brand} {moto.model}
                      </h3>
                      <span className="moto-year">{moto.year}</span>
                    </div>

                    <p className="moto-color">{moto.color || "Color estándar"}</p>

                    <div className="moto-spec-pills">
                      <span className="spec-pill">
                        <IconBolt />
                        {cc} cc
                      </span>
                      <span className="spec-pill">
                        <IconGauge />
                        {typeof moto.KM === "number"
                          ? `${moto.KM.toLocaleString("es-CO")} km`
                          : "Km verificado"}
                      </span>
                      <span className="spec-pill">
                        <IconShieldCheck />
                        Lic. {licencia}
                      </span>
                    </div>

                    <div className="moto-card-footer">
                      <div className="moto-price-line">
                        <span className="moto-price">
                          ${Number(moto.dailyRate).toLocaleString("es-CO")}
                        </span>
                        <span className="day-text">/ día</span>
                      </div>

                      <button
                        type="button"
                        className="details-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalMoto(moto);
                        }}
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!cargando && motosFiltradas.length === 0 && (
          <div className="no-results-box">
            <p className="no-results">No se encontraron motocicletas con esos filtros.</p>
            <button type="button" className="reset-filter-btn" onClick={limpiarFiltros}>
              Ver todas las motos
            </button>
          </div>
        )}
      </main>

      {/* Modal de detalle sencillo */}
      {motoSeleccionada && (
        <div className="modal-overlay" onClick={() => setMotoSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Cerrar detalle"
              onClick={() => setMotoSeleccionada(null)}
            >
              ✕
            </button>

            <div className="modal-header">
              <div className="modal-badges">
                <span className="modal-badge modal-badge--accent">{categoriaModal}</span>
                <span className="modal-badge">{obtenerTipoUso(categoriaModal)}</span>
                {motoSeleccionada.licensePlate && (
                  <span className="modal-badge">Placa {motoSeleccionada.licensePlate}</span>
                )}
              </div>

              <h2>
                {motoSeleccionada.brand} {motoSeleccionada.model}{" "}
                <span className="modal-title-year">{motoSeleccionada.year}</span>
              </h2>
              <p className="modal-subtitle">
                {motoSeleccionada.brand} {motoSeleccionada.model} {motoSeleccionada.year},{" "}
                {obtenerTipoUso(categoriaModal).toLowerCase()} de {ccModal} cc
                {motoSeleccionada.color ? ` en color ${motoSeleccionada.color.toLowerCase()}.` : "."}
              </p>
            </div>

            <div className="modal-body-grid">
              {/* Columna izquierda: Foto + Descripción + Ficha técnica + Propietario */}
              <div className="modal-left-col">
                <div className="modal-gallery">
                  <div className="modal-photo-frame">
                    <img
                      src={obtenerFotoMoto(motoSeleccionada)}
                      alt={`${motoSeleccionada.brand} ${motoSeleccionada.model}`}
                    />
                    <span className="modal-photo-caption">
                      <IconCamera />
                      Foto principal de la motocicleta
                    </span>
                    <span className="modal-photo-counter">1 / 1</span>
                  </div>

                  <div className="modal-info-strip">
                    <IconInfo />
                    <span>
                      Antes de cada entrega y en cada devolución se realiza una inspección con fotos
                      para respaldar el estado del vehículo.
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <section className="modal-section">
                  <h3>Descripción</h3>
                  <blockquote className="modal-description-quote">
                    {motoSeleccionada.description}
                  </blockquote>
                  <p className="modal-description-text">
                    Para conducirla necesitas licencia de conducción categoría {licenciaModal}{" "}
                    vigente y tu perfil de arrendatario verificado en MotoRent.
                  </p>

                  <div className="modal-highlights">
                    <span className="modal-highlight-item">
                      <IconCheckCircle />
                      {ccModal} cc · {obtenerTipoUso(categoriaModal)}
                    </span>
                    <span className="modal-highlight-item">
                      <IconCheckCircle />
                      {typeof motoSeleccionada.KM === "number"
                        ? `${motoSeleccionada.KM.toLocaleString("es-CO")} km · ${obtenerEstadoKm(
                            motoSeleccionada.KM
                          )}`
                        : "Kilometraje verificado"}
                    </span>
                    <span className="modal-highlight-item">
                      <IconCheckCircle />
                      Modelo {motoSeleccionada.year}
                    </span>
                    <span className="modal-highlight-item">
                      <IconCheckCircle />
                      Licencia {licenciaModal}
                    </span>
                    <span className="modal-highlight-item">
                      <IconCheckCircle />
                      SOAT y tecnomecánica al día
                    </span>
                  </div>
                </section>

                {/* Ficha técnica */}
                <section className="modal-section">
                  <h3>Ficha técnica</h3>
                  <div className="tech-grid">
                    <div className="tech-card">
                      <span className="tech-label">
                        <IconBolt />
                        Cilindraje
                      </span>
                      <strong>{ccModal} cc</strong>
                    </div>

                    <div className="tech-card">
                      <span className="tech-label">
                        <IconGauge />
                        Kilometraje
                      </span>
                      <strong>
                        {typeof motoSeleccionada.KM === "number"
                          ? `${motoSeleccionada.KM.toLocaleString("es-CO")} km`
                          : "Verificado"}
                      </strong>
                    </div>

                    <div className="tech-card">
                      <span className="tech-label">
                        <IconCalendar />
                        Modelo
                      </span>
                      <strong>{motoSeleccionada.year}</strong>
                    </div>

                    <div className="tech-card">
                      <span className="tech-label">
                        <IconPalette />
                        Color
                      </span>
                      <strong>{motoSeleccionada.color || "Estándar"}</strong>
                    </div>

                    <div className="tech-card">
                      <span className="tech-label">
                        <IconShieldCheck />
                        Licencia
                      </span>
                      <strong>{licenciaModal}</strong>
                    </div>

                    <div className="tech-card">
                      <span className="tech-label">
                        <IconCheckCircle />
                        Estado
                      </span>
                      <strong>{obtenerEstadoKm(motoSeleccionada.KM)}</strong>
                    </div>
                  </div>
                </section>

                {/* Propietario */}
                <div className="modal-owner-card">
                  <div className="modal-owner-avatar">
                    <IconUser />
                  </div>
                  <div className="modal-owner-info">
                    <strong>Propietario: {nombrePropietario}</strong>
                    <span>Identidad verificada en MotoRent</span>
                  </div>
                  <span className="modal-owner-status">Disponible</span>
                </div>
              </div>

              {/* Columna derecha: Calculadora y acción de reserva */}
              <aside className="modal-booking-card">
                <div className="booking-price-header">
                  <strong className="booking-price">
                    ${tarifaNumero.toLocaleString("es-CO")}
                  </strong>
                  <span>por día</span>
                </div>

                <div className="date-inputs">
                  <div className="input-group">
                    <label htmlFor="fecha-recogida">Fecha de recogida</label>
                    <input
                      id="fecha-recogida"
                      type="date"
                      min={hoy}
                      value={fechaInicio}
                      onChange={(e) => {
                        const nuevaInicio = e.target.value;
                        setFechaInicio(nuevaInicio);
                        if (fechaFin <= nuevaInicio) {
                          const siguiente = new Date(nuevaInicio);
                          siguiente.setDate(siguiente.getDate() + 1);
                          setFechaFin(siguiente.toISOString().split("T")[0]);
                        }
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="fecha-devolucion">Fecha de devolución</label>
                    <input
                      id="fecha-devolucion"
                      type="date"
                      min={fechaInicio}
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="cost-summary">
                  <div className="summary-row">
                    <span>
                      ${tarifaNumero.toLocaleString("es-CO")} × {diasRenta}{" "}
                      {diasRenta === 1 ? "día" : "días"}
                    </span>
                    <span>${precioTotal.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total estimado</span>
                    <strong className="total-amount">
                      ${precioTotal.toLocaleString("es-CO")} COP
                    </strong>
                  </div>
                </div>

                {mensajeRenta && (
                  <div className={`booking-feedback booking-feedback--${mensajeRenta.tipo}`}>
                    <p>{mensajeRenta.texto}</p>
                    {mensajeRenta.necesitaPerfil && (
                      <Link to="/verificar-renter" className="booking-feedback-link">
                        Completar perfil de arrendatario →
                      </Link>
                    )}
                  </div>
                )}

                {haySesion ? (
                  <button
                    type="button"
                    className="btn-confirm-rental"
                    disabled={enviandoRenta}
                    onClick={handleSolicitarRenta}
                  >
                    {enviandoRenta ? "Enviando solicitud..." : "Solicitar renta"}
                  </button>
                ) : (
                  <div className="guest-modal-action">
                    <p>Debes iniciar sesión para solicitar una renta</p>
                    <Link to="/login" className="btn-modal-login">
                      Iniciar sesión para reservar
                    </Link>
                  </div>
                )}

                <p className="booking-footnote">
                  Se realiza inspección con fotos al entregar y al devolver la moto.
                </p>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Motos;
