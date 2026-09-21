import "./perfil.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ----------------------------------------------------------------------
// 1. DATOS DE EJEMPLO DEL USUARIO (Luego vendrán de tu API /auth/me)
// ----------------------------------------------------------------------
const usuarioEjemplo = {
  fullName: "Harold Merchán",
  username: "haroldm",
  email: "harold@correo.com",
  phone: "3001234567",
};

function Perfil() {
  const navigate = useNavigate();

  // ----------------------------------------------------------------------
  // 2. CONTROL DE PESTAÑAS (TABS)
  // 'datos' | 'conductor' | 'propietario'
  // ----------------------------------------------------------------------
  const [tabActiva, setTabActiva] = useState<"datos" | "conductor" | "propietario">("datos");

  // ----------------------------------------------------------------------
  // 3. ESTADOS DEL PERFIL DE CONDUCTOR (CLIENT)
  // Documentos necesarios para poder manejar y rentar motos en la app
  // ----------------------------------------------------------------------
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState("A2");
  const [licenseExpiration, setLicenseExpiration] = useState("");
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);

  // Estados de verificación simulados (PENDIENTE, VERIFICADO, RECHAZADO)
  const [estadoConductor] = useState("PENDIENTE");
  const [conductorGuardado, setConductorGuardado] = useState(false);

  // ----------------------------------------------------------------------
  // 4. ESTADOS DEL PERFIL DE PROPIETARIO (OWNER)
  // Datos bancarios donde MotoRent le transferirá el dinero de los alquileres
  // ----------------------------------------------------------------------
  const [bankName, setBankName] = useState("Bancolombia");
  const [accountType, setAccountType] = useState("Ahorros");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderDoc, setAccountHolderDoc] = useState("");
  const [propietarioGuardado, setPropietarioGuardado] = useState(false);

  // ----------------------------------------------------------------------
  // 5. CERRAR SESIÓN
  // ----------------------------------------------------------------------
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  // Guardar datos de conductor
  function handleGuardarConductor(e: React.FormEvent) {
    e.preventDefault();
    setConductorGuardado(true);
    setTimeout(() => setConductorGuardado(false), 4000);
  }

  // Guardar datos de propietario
  function handleGuardarPropietario(e: React.FormEvent) {
    e.preventDefault();
    setPropietarioGuardado(true);
    setTimeout(() => setPropietarioGuardado(false), 4000);
  }

  return (
    <div className="perfil-page">
      {/* ================================================================ */}
      {/* NAVBAR SUPERIOR                                                  */}
      {/* ================================================================ */}
      <header className="perfil-navbar">
        <Link to="/" className="logo">
          <span>MOTO</span>RENT
        </Link>

        <nav className="perfil-nav-links">
          <Link to="/dashboard">Mi Panel</Link>
          <Link to="/motos">Catálogo</Link>
          <Link to="/publicarmoto" className="link-publicar">
            + Publicar moto
          </Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* ================================================================ */}
      {/* CONTENIDO DEL PERFIL                                             */}
      {/* ================================================================ */}
      <main className="perfil-content">
        <div className="perfil-header-box">
          <div className="avatar-circle">
            {usuarioEjemplo.fullName.charAt(0)}
          </div>
          <div>
            <h1>{usuarioEjemplo.fullName}</h1>
            <p className="user-email">{usuarioEjemplo.email} • @{usuarioEjemplo.username}</p>
          </div>
        </div>

        {/* NAVEGACIÓN ENTRE PESTAÑAS (TABS) */}
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

        {/* ================================================================ */}
        {/* PESTAÑA 1: DATOS PERSONALES DE LA CUENTA                         */}
        {/* ================================================================ */}
        {tabActiva === "datos" && (
          <section className="perfil-card">
            <h2>Información de tu cuenta</h2>
            <p className="perfil-card-subtitle">
              Estos son los datos con los que te registraste en la plataforma.
            </p>

            <div className="perfil-datos-grid">
              <div className="perfil-dato">
                <span className="perfil-dato-label">Nombre completo</span>
                <span className="perfil-dato-valor">{usuarioEjemplo.fullName}</span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Nombre de usuario</span>
                <span className="perfil-dato-valor">@{usuarioEjemplo.username}</span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Correo electrónico</span>
                <span className="perfil-dato-valor">{usuarioEjemplo.email}</span>
              </div>
              <div className="perfil-dato">
                <span className="perfil-dato-label">Número de celular</span>
                <span className="perfil-dato-valor">+57 {usuarioEjemplo.phone}</span>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 2: VERIFICACIÓN DE CONDUCTOR (CLIENTE)                    */}
        {/* ================================================================ */}
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
              {/* DOCUMENTO DE IDENTIDAD */}
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
                  {documentFront && <span className="file-indicator">✓ {documentFront.name}</span>}
                </div>

                <div className="perfil-upload-field">
                  <label>Foto Cédula Posterior *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDocumentBack(e.target.files?.[0] ?? null)}
                  />
                  {documentBack && <span className="file-indicator">✓ {documentBack.name}</span>}
                </div>
              </div>

              {/* LICENCIA DE CONDUCCIÓN */}
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
                  <select value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)}>
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
                  {licenseFront && <span className="file-indicator">✓ {licenseFront.name}</span>}
                </div>

                <div className="perfil-upload-field">
                  <label>Foto Licencia Posterior *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLicenseBack(e.target.files?.[0] ?? null)}
                  />
                  {licenseBack && <span className="file-indicator">✓ {licenseBack.name}</span>}
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

        {/* ================================================================ */}
        {/* PESTAÑA 3: PERFIL DE PROPIETARIO (DATOS BANCARIOS)                */}
        {/* ================================================================ */}
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