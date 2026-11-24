import { useCallback, useEffect, useState } from "react";
import {
  IconAlert,
  IconCheckCircle,
  IconDocument,
  IconEye,
  IconMoto,
  IconRefresh,
  IconShieldCheck,
  IconUser,
} from "../../../components/Icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type SubTabVerif = "renter" | "owner";
type PestanaAdmin = "verificaciones" | "motos";

interface UsuarioSolicitud {
  fullName: string;
  email: string;
  phone: string;
  username?: string;
}

interface SolicitudVerificacion {
  id: string;
  idUser: string;
  cedulaNumero?: string | null;
  cedulaFrontUrl?: string | null;
  cedulaBackUrl?: string | null;
  photo?: string | null;
  billUrl?: string | null;
  licenseNumber?: string | null;
  licenseCategory?: string | null;
  licenseFrontUrl?: string | null;
  licenseBackUrl?: string | null;
  estadoVerificacion: string;
  updatedAt?: string;
  user: UsuarioSolicitud;
}

interface MotoAdmin {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  displacement: string | number;
  dailyRate: string | number;
  status?: string;
}

interface DocInspeccion {
  etiqueta: string;
  url: string;
  esPdf: boolean;
}

function construirDocsSolicitud(
  tipo: SubTabVerif,
  item: SolicitudVerificacion
): DocInspeccion[] {
  const docs: DocInspeccion[] = [];
  const agregar = (etiqueta: string, url?: string | null) => {
    if (url && url !== "Pendiente") {
      docs.push({
        etiqueta,
        url,
        esPdf: url.startsWith("data:application/pdf") || url.toLowerCase().endsWith(".pdf"),
      });
    }
  };

  agregar("Cédula (Frontal)", item.cedulaFrontUrl);
  agregar("Cédula (Reverso)", item.cedulaBackUrl);
  agregar("Foto de rostro", item.photo);
  if (tipo === "renter") {
    agregar("Licencia (Frontal)", item.licenseFrontUrl);
    agregar("Licencia (Reverso)", item.licenseBackUrl);
  }
  agregar("Recibo de domicilio", item.billUrl);

  return docs;
}

function formatearFechaCorta(fecha?: string): string {
  if (!fecha) return "Reciente";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "Reciente";
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DashboardAdminView() {
  const [renters, setRenters] = useState<SolicitudVerificacion[]>([]);
  const [owners, setOwners] = useState<SolicitudVerificacion[]>([]);
  const [motos, setMotos] = useState<MotoAdmin[]>([]);
  const [cargando, setCargando] = useState(true);

  const [pestana, setPestana] = useState<PestanaAdmin>("verificaciones");
  const [subTabVerif, setSubTabVerif] = useState<SubTabVerif>("renter");

  const [aviso, setAviso] = useState<{
    tipo: "info" | "error" | "success";
    texto: string;
  } | null>(null);

  const [rechazoActivoId, setRechazoActivoId] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  const [docsAbiertosId, setDocsAbiertosId] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<DocInspeccion | null>(null);

  const cargarTodo = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setCargando(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resOwners, resRenters, resMotos] = await Promise.allSettled([
        fetch(`${API_URL}/create/perfil/solicitudes/owner`, { headers }),
        fetch(`${API_URL}/create/perfil/solicitudes/renter`, { headers }),
        fetch(`${API_URL}/api/motos`),
      ]);

      if (resOwners.status === "fulfilled" && resOwners.value.ok) {
        const json = await resOwners.value.json();
        setOwners(Array.isArray(json.data) ? json.data : []);
      }

      if (resRenters.status === "fulfilled" && resRenters.value.ok) {
        const json = await resRenters.value.json();
        setRenters(Array.isArray(json.data) ? json.data : []);
      }

      if (resMotos.status === "fulfilled" && resMotos.value.ok) {
        const json = await resMotos.value.json();
        const lista = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];
        setMotos(lista);
      }
      setAviso(null);
    } catch {
      setAviso({
        tipo: "error",
        texto: "No se pudo sincronizar la cola administrativa con el servidor.",
      });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  async function resolverVerificacion(
    tipo: SubTabVerif,
    id: string,
    estado: "APPROVED" | "REJECTED"
  ) {
    if (estado === "REJECTED" && motivoRechazo.trim().length < 5) {
      setAviso({
        tipo: "error",
        texto: "Escribe un motivo de rechazo claro (mínimo 5 caracteres).",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const accion = estado === "APPROVED" ? "aprobar" : "rechazar";
    const endpoint = `${API_URL}/create/perfil/${accion}/${tipo}/${id}`;

    setProcesandoId(id);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:
          estado === "REJECTED"
            ? JSON.stringify({ motivoRechazo: motivoRechazo.trim() })
            : undefined,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAviso({
          tipo: "error",
          texto: data.message || data.mensaje || "No se pudo procesar la solicitud.",
        });
        setProcesandoId(null);
        return;
      }

      if (tipo === "renter") {
        setRenters((prev) => prev.filter((r) => r.id !== id));
      } else {
        setOwners((prev) => prev.filter((o) => o.id !== id));
      }

      setRechazoActivoId(null);
      setMotivoRechazo("");
      setAviso({
        tipo: "success",
        texto:
          data.message ||
          (estado === "APPROVED"
            ? "Solicitud aprobada correctamente."
            : "Solicitud rechazada con motivo registrado."),
      });
    } catch {
      setAviso({
        tipo: "error",
        texto: "Error de conexión al procesar la solicitud.",
      });
    } finally {
      setProcesandoId(null);
    }
  }

  const totalVerifPendientes = renters.length + owners.length;
  const listaActiva = subTabVerif === "renter" ? renters : owners;

  return (
    <>
      <section className="admin-notice-banner admin-notice-banner--flex">
        <div>
          <strong>Centro de Control Administrativo</strong>
          <p>
            Supervisa verificaciones de identidad de Arrendatarios y Propietarios
            con visor de documentos integrado, aprueba o rechaza solicitudes con
            motivo y consulta la flota registrada.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={cargarTodo}
          disabled={cargando}
        >
          <IconRefresh size={15} />
          <span>{cargando ? "Actualizando..." : "Actualizar"}</span>
        </button>
      </section>

      {aviso && (
        <div
          className={`admin-feedback-banner admin-feedback-banner--${aviso.tipo}`}
          role="status"
        >
          {aviso.tipo === "success" ? (
            <IconCheckCircle size={17} />
          ) : (
            <IconAlert size={17} />
          )}
          <span style={{ flex: 1 }}>{aviso.texto}</span>
        </div>
      )}

      {/* KPIS OPERATIVOS */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="icon-chip icon-chip--primary">
            <IconShieldCheck size={19} />
          </div>
          <p className="stat-number">{totalVerifPendientes}</p>
          <p className="stat-label">Verificaciones pendientes</p>
        </div>

        <div className="stat-card">
          <div className="icon-chip icon-chip--accent">
            <IconUser size={19} />
          </div>
          <p className="stat-number">{renters.length}</p>
          <p className="stat-label">Arrendatarios por aprobar</p>
        </div>

        <div className="stat-card">
          <div className="icon-chip icon-chip--neutral">
            <IconUser size={19} />
          </div>
          <p className="stat-number">{owners.length}</p>
          <p className="stat-label">Propietarios por aprobar</p>
        </div>

        <div className="stat-card">
          <div className="icon-chip icon-chip--primary">
            <IconMoto size={19} />
          </div>
          <p className="stat-number">{motos.length}</p>
          <p className="stat-label">Motocicletas en catálogo</p>
        </div>
      </section>

      <section className="admin-queue-section">
        <div className="admin-main-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={pestana === "verificaciones"}
            className={`admin-tab-btn ${pestana === "verificaciones" ? "active" : ""}`}
            onClick={() => setPestana("verificaciones")}
          >
            Verificaciones ({totalVerifPendientes})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pestana === "motos"}
            className={`admin-tab-btn ${pestana === "motos" ? "active" : ""}`}
            onClick={() => setPestana("motos")}
          >
            Motocicletas ({motos.length})
          </button>
        </div>

        {pestana === "verificaciones" && (
          <>
            <div className="admin-queue-header">
              <div className="section-title-box admin-queue-title">
                <h2>Solicitudes de identidad pendientes</h2>
                <p>Inspecciona los documentos antes de aprobar o rechazar.</p>
              </div>
              <div className="admin-tabs">
                <button
                  type="button"
                  className={`admin-tab-btn ${subTabVerif === "renter" ? "active" : ""}`}
                  onClick={() => setSubTabVerif("renter")}
                >
                  Arrendatarios ({renters.length})
                </button>
                <button
                  type="button"
                  className={`admin-tab-btn ${subTabVerif === "owner" ? "active" : ""}`}
                  onClick={() => setSubTabVerif("owner")}
                >
                  Propietarios ({owners.length})
                </button>
              </div>
            </div>

            {docPreview && (
              <div className="admin-doc-preview">
                <div className="admin-doc-preview-top">
                  <strong>Visor privado: {docPreview.etiqueta}</strong>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setDocPreview(null)}
                  >
                    Cerrar visor
                  </button>
                </div>
                {docPreview.esPdf ? (
                  <iframe
                    title={docPreview.etiqueta}
                    src={docPreview.url}
                    className="admin-doc-iframe"
                  />
                ) : (
                  <img
                    src={docPreview.url}
                    alt={docPreview.etiqueta}
                    className="admin-doc-img"
                  />
                )}
              </div>
            )}

            <div className="admin-queue-list">
              {listaActiva.length === 0 ? (
                <div className="admin-empty-queue">
                  <IconCheckCircle size={22} />
                  <div>
                    <strong>Cola al día</strong>
                    <p>No hay solicitudes pendientes en esta categoría.</p>
                  </div>
                </div>
              ) : (
                listaActiva.map((item) => {
                  const docs = construirDocsSolicitud(subTabVerif, item);
                  const docsAbiertos = docsAbiertosId === item.id;
                  const mostrandoRechazo = rechazoActivoId === item.id;
                  const enProceso = procesandoId === item.id;

                  return (
                    <article key={item.id} className="admin-request-card">
                      <div className="admin-request-top">
                        <div>
                          <h3>{item.user?.fullName || "Usuario MotoRent"}</h3>
                          <p className="admin-request-meta">
                            {item.user?.email} · Tel: {item.user?.phone} ·{" "}
                            {formatearFechaCorta(item.updatedAt)}
                          </p>
                        </div>
                        <span className="role-status-pill role-status-pill--pending">
                          Pendiente · {subTabVerif === "renter" ? "Renter" : "Owner"}
                        </span>
                      </div>

                      <div className="admin-request-grid">
                        <div>
                          <span>Cédula</span>
                          <strong>{item.cedulaNumero || "Sin número"}</strong>
                        </div>
                        {subTabVerif === "renter" && item.licenseNumber && (
                          <div>
                            <span>Licencia</span>
                            <strong>
                              {item.licenseNumber} (Cat. {item.licenseCategory || "A2"})
                            </strong>
                          </div>
                        )}
                        <div>
                          <span>Soportes adjuntos</span>
                          <strong>{docs.length} archivos</strong>
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          onClick={() =>
                            setDocsAbiertosId(docsAbiertos ? null : item.id)
                          }
                        >
                          <IconEye size={14} />{" "}
                          {docsAbiertos ? "Ocultar documentos" : "Inspeccionar documentos"}
                        </button>

                        {docsAbiertos && (
                          <div className="admin-docs-grid">
                            {docs.map((doc) => (
                              <button
                                key={doc.etiqueta}
                                type="button"
                                className="admin-doc-chip"
                                onClick={() => setDocPreview(doc)}
                              >
                                <IconDocument size={14} />
                                <span>{doc.etiqueta}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {mostrandoRechazo ? (
                        <div className="admin-reject-box">
                          <label htmlFor={`motivo-${item.id}`}>
                            Motivo de rechazo (visible para el usuario)
                          </label>
                          <textarea
                            id={`motivo-${item.id}`}
                            rows={2}
                            value={motivoRechazo}
                            placeholder="Ej: La fotografía de la cédula posterior no es legible."
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                          />
                          <div className="admin-request-actions">
                            <button
                              type="button"
                              className="admin-btn-danger"
                              disabled={enProceso}
                              onClick={() =>
                                resolverVerificacion(subTabVerif, item.id, "REJECTED")
                              }
                            >
                              Confirmar rechazo
                            </button>
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              onClick={() => {
                                setRechazoActivoId(null);
                                setMotivoRechazo("");
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-request-actions">
                          <button
                            type="button"
                            className="admin-btn-approve"
                            disabled={enProceso}
                            onClick={() =>
                              resolverVerificacion(subTabVerif, item.id, "APPROVED")
                            }
                          >
                            Aprobar perfil
                          </button>
                          <button
                            type="button"
                            className="admin-btn-reject"
                            disabled={enProceso}
                            onClick={() => {
                              setRechazoActivoId(item.id);
                              setMotivoRechazo("");
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}

        {pestana === "motos" && (
          <div className="admin-queue-list">
            {motos.length === 0 ? (
              <div className="admin-empty-queue">
                <IconCheckCircle size={22} />
                <div>
                  <strong>Sin motocicletas registradas</strong>
                  <p>Las motos publicadas aparecerán aquí.</p>
                </div>
              </div>
            ) : (
              motos.map((moto) => (
                <article key={moto.id} className="admin-request-card">
                  <div className="admin-request-top">
                    <div>
                      <h3>
                        {moto.brand} {moto.model} ({moto.year})
                      </h3>
                      <p className="admin-request-meta">
                        Placa: {moto.licensePlate} · {moto.displacement} cc · $
                        {Number(moto.dailyRate).toLocaleString("es-CO")} COP/día
                      </p>
                    </div>
                    <span className="role-status-pill role-status-pill--approved">
                      {moto.status || "AVAILABLE"}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default DashboardAdminView;
