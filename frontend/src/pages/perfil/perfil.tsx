// frontend/src/pages/perfil/perfil.tsx
import "./perfil.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Si no existe variable de entorno, usa el puerto 3000 del backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface UsuarioData {
  id?: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role?: string;
  client?: any;
  owner?: any;
}

function Perfil() {
  const navigate = useNavigate();

  // 1. ESTADO DEL USUARIO
  const [usuario, setUsuario] = useState<UsuarioData>({
    fullName: "Cargando datos...",
    username: "",
    email: "",
    phone: "",
  });

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  // 2. CONTROL DE PESTAÑAS (TABS)
  const [tabActiva, setTabActiva] = useState<"datos" | "conductor" | "propietario">("datos");

  // 3. ESTADOS DEL PERFIL DE CONDUCTOR (CLIENT)
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState("A2");
  const [licenseExpiration, setLicenseExpiration] = useState("");
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  const [estadoConductor] = useState("PENDIENTE");
  const [conductorGuardado, setConductorGuardado] = useState(false);

  // 4. ESTADOS DEL PERFIL DE PROPIETARIO (OWNER)
  const [bankName, setBankName] = useState("Bancolombia");
  const [accountType, setAccountType] = useState("Ahorros");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderDoc, setAccountHolderDoc] = useState("");
  const [propietarioGuardado, setPropietarioGuardado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          // Si el token es inválido o expiró
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          throw new Error(data.mensaje || data.message || "Error al obtener perfil");
        }
        return data;
      })
      .then((data) => {
        if (data && (data.user || data.ok)) {
          const userRecibido = data.user || data;
          setUsuario(userRecibido);
          localStorage.setItem("user", JSON.stringify(userRecibido));

          // Si ya tiene datos bancarios guardados, precargarlos
          if (userRecibido.owner) {
            if (userRecibido.owner.bankName) setBankName(userRecibido.owner.bankName);
            if (userRecibido.owner.accountType) setAccountType(userRecibido.owner.accountType);
            if (userRecibido.owner.accountNumber) setAccountNumber(userRecibido.owner.accountNumber);
            if (userRecibido.owner.accountHolderDoc) setAccountHolderDoc(userRecibido.owner.accountHolderDoc);
          }

          // Si ya tiene datos de conductor, precargarlos
          if (userRecibido.client) {
            if (userRecibido.client.documentNumber) setDocumentNumber(userRecibido.client.documentNumber);
            if (userRecibido.client.licenseNumber) setLicenseNumber(userRecibido.client.licenseNumber);
            if (userRecibido.client.licenseCategory) setLicenseCategory(userRecibido.client.licenseCategory);
          }
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
        setErrorCarga("No se pudo conectar con el servidor backend.");
        setCargando(false);
      });
  }, [navigate]);

  function handleGuardarConductor(e: React.FormEvent) {
    e.preventDefault();
    setConductorGuardado(true);
    setTimeout(() => setConductorGuardado(false), 4000);
  }

  function handleGuardarPropietario(e: React.FormEvent) {
    e.preventDefault();
    setPropietarioGuardado(true);
    setTimeout(() => setPropietarioGuardado(false), 4000);
  }

  return (
    <div className="perfil-page">
      <main className="perfil-content">
        <div className="perfil-header-box">
          <div className="avatar-circle">
            {usuario.fullName && usuario.fullName !== "Cargando datos..."
              ? usuario.fullName.charAt(0).toUpperCase()
              : "U"}
          </div>
          <div>
            <h1>{usuario.fullName}</h1>
            <p className="user-email">
              {usuario.email} {usuario.username ? `• @${usuario.username}` : ""}
            </p>
          </div>
        </div>

        {errorCarga && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#B91C1C",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            ⚠️ {errorCarga}
          </div>
        )}

        {/* NAVEGACIÓN ENTRE PESTAÑAS */}
        <div className="perfil-tabs">
          <button
            className={tabActiva === "datos" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTabActiva("datos")}
          >
            👤 Mis Datos Personales
          </button>
          <button
            className={tabActiva === "conductor" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTabActiva("conductor")}
          >
            🪪 Perfil Conductor (Cliente)
          </button>
          <button
            className={tabActiva === "propietario" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTabActiva("propietario")}
          >
            🏦 Perfil Propietario (Dueño)
          </button>
        </div>

        {/* PESTAÑA 1: DATOS PERSONALES */}
        {tabActiva === "datos" && (
          <section className="perfil-card">
            <h2>Información de tu cuenta</h2>
            <p className="perfil-card-subtitle">
              Estos son los datos con los que te registraste en la plataforma.
            </p>

            <div className="perfil-datos-grid">
              <div className="perfil-dato">
                <span className="perfil-dato-label">Nombre completo</span>
                <span className="perfil-dato-valor">{usuario.fullName}</span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Nombre de usuario</span>
                <span className="perfil-dato-valor">@{usuario.username || "No definido"}</span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Correo electrónico</span>
                <span className="perfil-dato-valor">{usuario.email || "No definido"}</span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Número de celular</span>
                <span className="perfil-dato-valor">
                  {usuario.phone ? `+57 ${usuario.phone}` : "No definido"}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA 2: CONDUCTOR */}
        {tabActiva === "conductor" && (
          <section className="perfil-card">
            <div className="card-top-row">
              <h2>Verificación de Conductor</h2>
              <span className={`status-badge ${estadoConductor.toLowerCase()}`}>
                Estado: {estadoConductor}
              </span>
            </div>
            <p className="perfil-card-subtitle">
              Sube tu documento de identidad y licencia de conducción colombiana para poder rentar cualquier moto.
            </p>

            <form onSubmit={handleGuardarConductor}>
              <h3 className="perfil-subsection">1. Cédula de Ciudadanía</h3>
              <div className="perfil-form-field">
                <label>Número de documento *</label>
                <input
                  type="text"
                  placeholder="Ej. 1020304050"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  required
                />
              </div>

              <div className="perfil-upload-row">
                <div className="perfil-upload-field">
                  <label>Foto Cédula Frontal *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDocumentFront(e.target.files?.[0] ?? null)}
                  />
                  {documentFront && (
                    <span className="file-indicator">✓ {documentFront.name}</span>
                  )}
                </div>

                <div className="perfil-upload-field">
                  <label>Foto Cédula Posterior *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDocumentBack(e.target.files?.[0] ?? null)}
                  />
                  {documentBack && (
                    <span className="file-indicator">✓ {documentBack.name}</span>
                  )}
                </div>
              </div>

              <h3 className="perfil-subsection">2. Licencia de Conducción</h3>
              <div className="form-two-cols">
                <div className="perfil-form-field">
                  <label>Número de licencia *</label>
                  <input
                    type="text"
                    placeholder="Número de licencia"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="perfil-form-field">
                  <label>Categoría *</label>
                  <select
                    value={licenseCategory}
                    onChange={(e) => setLicenseCategory(e.target.value)}
                  >
                    <option value="A1">A1 (Hasta 125cc)</option>
                    <option value="A2">A2 (Cualquier cilindraje - Recomendada)</option>
                  </select>
                </div>
              </div>

              <div className="perfil-form-field">
                <label>Fecha de vencimiento *</label>
                <input
                  type="date"
                  value={licenseExpiration}
                  onChange={(e) => setLicenseExpiration(e.target.value)}
                  required
                />
              </div>

              <div className="perfil-upload-row">
                <div className="perfil-upload-field">
                  <label>Foto Licencia Frontal *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLicenseFront(e.target.files?.[0] ?? null)}
                  />
                  {licenseFront && (
                    <span className="file-indicator">✓ {licenseFront.name}</span>
                  )}
                </div>

                <div className="perfil-upload-field">
                  <label>Foto Licencia Posterior *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLicenseBack(e.target.files?.[0] ?? null)}
                  />
                  {licenseBack && (
                    <span className="file-indicator">✓ {licenseBack.name}</span>
                  )}
                </div>
              </div>

              <button type="submit" className="perfil-submit-button">
                Guardar y solicitar verificación
              </button>

              {conductorGuardado && (
                <p className="perfil-success-message">
                  ✓ Documentos guardados exitosamente. El administrador los revisará en breve.
                </p>
              )}
            </form>
          </section>
        )}

        {/* PESTAÑA 3: PROPIETARIO */}
        {tabActiva === "propietario" && (
          <section className="perfil-card">
            <div className="card-top-row">
              <h2>Cuenta de Cobro y Propietario</h2>
              <Link to="/publicarmoto" className="btn-small-cta">
                + Publicar una moto
              </Link>
            </div>
            <p className="perfil-card-subtitle">
              Aquí es donde MotoRent te transferirá las ganancias (el 85% del valor de cada alquiler) a tu cuenta bancaria.
            </p>

            <form onSubmit={handleGuardarPropietario}>
              <div className="form-two-cols">
                <div className="perfil-form-field">
                  <label>Entidad Bancaria *</label>
                  <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                    <option value="Bancolombia">Bancolombia</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Daviplata">Daviplata</option>
                    <option value="Davivienda">Davivienda</option>
                    <option value="BBVA">BBVA Colombia</option>
                    <option value="Banco de Bogotá">Banco de Bogotá</option>
                  </select>
                </div>

                <div className="perfil-form-field">
                  <label>Tipo de Cuenta *</label>
                  <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                    <option value="Ahorros">Cuenta de Ahorros</option>
                    <option value="Corriente">Cuenta Corriente</option>
                  </select>
                </div>
              </div>

              <div className="form-two-cols">
                <div className="perfil-form-field">
                  <label>Número de Cuenta o Celular (Nequi/Daviplata) *</label>
                  <input
                    type="text"
                    placeholder="Ej. 1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="perfil-form-field">
                  <label>Cédula del titular de la cuenta *</label>
                  <input
                    type="text"
                    placeholder="Cédula asociada a la cuenta"
                    value={accountHolderDoc}
                    onChange={(e) => setAccountHolderDoc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="info-box-payout">
                <span>💡</span>
                <p>
                  Los pagos de tus alquileres se liquidan automáticamente a tu cuenta cada semana o al finalizar cada contrato de renta.
                </p>
              </div>

              <button type="submit" className="perfil-submit-button">
                Guardar datos bancarios
              </button>

              {propietarioGuardado && (
                <p className="perfil-success-message">
                  ✓ Cuenta bancaria actualizada. Ya puedes recibir ingresos de tus motos.
                </p>
              )}
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default Perfil;