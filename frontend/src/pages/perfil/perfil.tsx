import "./Perfil.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Datos de ejemplo — luego los traemos del backend (endpoint /auth/me)
const usuarioEjemplo = {
  fullName: "Harold Merchán",
  username: "haroldm",
  email: "harold@correo.com",
  phone: "3001234567",
};

function Perfil() {
  const navigate = useNavigate();

  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState("");
  const [licenseExpiration, setLicenseExpiration] = useState("");
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);

  const [enviado, setEnviado] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    window.history.pushState(null, "", "/login");
    navigate("/login", { replace: true });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Por ahora solo confirmamos en pantalla — falta el endpoint del backend
    // para guardar esto de verdad (ver nota al final de la respuesta)
    console.log({
      documentNumber,
      documentFront,
      documentBack,
      licenseNumber,
      licenseCategory,
      licenseExpiration,
      licenseFront,
      licenseBack,
    });

    setEnviado(true);
  }

  return (
    <div className="perfil-page">

      <header className="perfil-navbar">
        <div className="logo">
          <span>MOTO</span>RENT
        </div>

        <nav className="perfil-nav-links">
          <Link to="/dashboard">Inicio</Link>
          <Link to="/motos">Motos</Link>
          <Link to="/rentas">Mis rentas</Link>
          <Link to="/perfil">Mi perfil</Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="perfil-content">

        <h1>Mi perfil</h1>

        {/* Datos del usuario */}
        <section className="perfil-card">
          <h2>Mis datos</h2>

          <div className="perfil-datos-grid">
            <div className="perfil-dato">
              <span className="perfil-dato-label">Nombre completo</span>
              <span className="perfil-dato-valor">{usuarioEjemplo.fullName}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Usuario</span>
              <span className="perfil-dato-valor">{usuarioEjemplo.username}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Correo</span>
              <span className="perfil-dato-valor">{usuarioEjemplo.email}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Teléfono</span>
              <span className="perfil-dato-valor">{usuarioEjemplo.phone}</span>
            </div>
          </div>
        </section>

        {/* Verificación de documento y licencia */}
        <section className="perfil-card">
          <div className="verification-status pending">
            Verificación pendiente
          </div>

          <h2>Verificación de identidad</h2>
          <p className="perfil-card-subtitle">
            Sube tu documento y licencia de conducción para poder rentar una moto.
          </p>

          <form onSubmit={handleSubmit}>

            <h3 className="perfil-subsection">Documento de identidad</h3>

            <div className="perfil-form-field">
              <label>Número de documento</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>

            <div className="perfil-upload-row">
              <div className="perfil-upload-field">
                <label>Foto frontal</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDocumentFront(e.target.files?.[0] ?? null)}
                />
                {documentFront && <span className="perfil-file-name">{documentFront.name}</span>}
              </div>

              <div className="perfil-upload-field">
                <label>Foto trasera</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDocumentBack(e.target.files?.[0] ?? null)}
                />
                {documentBack && <span className="perfil-file-name">{documentBack.name}</span>}
              </div>
            </div>

            <h3 className="perfil-subsection">Licencia de conducción</h3>

            <div className="perfil-form-field">
              <label>Número de licencia</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>

            <div className="perfil-form-field">
              <label>Categoría</label>
              <input
                type="text"
                placeholder="Ej: A2"
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
              />
            </div>

            <div className="perfil-form-field">
              <label>Fecha de vencimiento</label>
              <input
                type="date"
                value={licenseExpiration}
                onChange={(e) => setLicenseExpiration(e.target.value)}
              />
            </div>

            <div className="perfil-upload-row">
              <div className="perfil-upload-field">
                <label>Foto frontal</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLicenseFront(e.target.files?.[0] ?? null)}
                />
                {licenseFront && <span className="perfil-file-name">{licenseFront.name}</span>}
              </div>

              <div className="perfil-upload-field">
                <label>Foto trasera</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLicenseBack(e.target.files?.[0] ?? null)}
                />
                {licenseBack && <span className="perfil-file-name">{licenseBack.name}</span>}
              </div>
            </div>

            <button type="submit" className="perfil-submit-button">
              Enviar para verificación
            </button>

            {enviado && (
              <p className="perfil-success-message">
                Documentos guardados. Cuando conectemos el backend, aquí se enviarán de verdad.
              </p>
            )}

          </form>
        </section>

      </main>

    </div>
  );
}

export default Perfil;