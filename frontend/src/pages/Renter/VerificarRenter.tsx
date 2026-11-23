import { useState, type ChangeEvent } from "react";
import {
  enviarSolicitudRenter,
  validarArchivoBasico,
} from "../../services/perfilSolicitud.service";
import "./VerificarRenter.css";

function VerificarRenter() {
  const [step, setStep] = useState(1);

  // Paso 1: Identidad
  const [cedulaNumero, setCedulaNumero] = useState("");
  const [cedulaFront, setCedulaFront] = useState<File | null>(null);
  const [cedulaBack, setCedulaBack] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  // Paso 2: Licencia de conducción
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState<"" | "A1" | "A2">("");
  const [licenseExpirationDate, setLicenseExpirationDate] = useState("");
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);

  // Paso 3: Comprobante de domicilio
  const [bill, setBill] = useState<File | null>(null);

  // Estados de envío y mensajes al usuario
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const fechaMinima = new Date().toISOString().split("T")[0];

  const manejarArchivo = (
    evento: ChangeEvent<HTMLInputElement>,
    guardar: (archivo: File | null) => void,
    permitirPdf = false
  ) => {
    const archivo = evento.target.files?.[0] ?? null;
    if (!archivo) return;

    const mensajeError = validarArchivoBasico(archivo, permitirPdf);
    if (mensajeError) {
      setError(mensajeError);
      evento.target.value = "";
      return;
    }

    setError("");
    guardar(archivo);
  };

  const siguientePaso = () => {
    setError("");

    if (step === 1) {
      if (!/^\d{6,12}$/.test(cedulaNumero.trim())) {
        setError("Ingresa un número de cédula válido (entre 6 y 12 dígitos).");
        return;
      }
      if (!cedulaFront || !cedulaBack || !photo) {
        setError(
          "Adjunta las fotos de tu cédula (frontal y posterior) y tu fotografía personal."
        );
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (licenseNumber.trim().length < 6) {
        setError("Ingresa un número de licencia válido (mínimo 6 caracteres).");
        return;
      }
      if (licenseCategory !== "A1" && licenseCategory !== "A2") {
        setError("Selecciona la categoría de tu licencia (A1 o A2).");
        return;
      }
      if (!licenseExpirationDate || new Date(licenseExpirationDate) <= new Date()) {
        setError("Ingresa una fecha de vencimiento vigente (futura) para tu licencia.");
        return;
      }
      if (!licenseFront || !licenseBack) {
        setError("Adjunta las fotos frontal y posterior de tu licencia.");
        return;
      }
      setStep(3);
    }
  };

  const pasoAnterior = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const manejarEnvio = async () => {
    setError("");
    setExito("");

    if (
      !cedulaFront ||
      !cedulaBack ||
      !photo ||
      !licenseFront ||
      !licenseBack ||
      !bill ||
      (licenseCategory !== "A1" && licenseCategory !== "A2")
    ) {
      setError("Adjunta el comprobante de domicilio antes de enviar tu solicitud.");
      return;
    }

    setEnviando(true);
    const resultado = await enviarSolicitudRenter({
      cedulaNumero,
      cedulaFront,
      cedulaBack,
      photo,
      licenseNumber,
      licenseCategory,
      licenseExpirationDate,
      licenseFront,
      licenseBack,
      bill,
    });
    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setExito(resultado.mensaje);
  };

  return (
    <main className="renter-page">
      <section className="renter-card">
        {/* Encabezado */}
        <header className="renter-header">
          <span className="renter-tag">MOTORENT</span>

          <h1>Verificación de arrendatario</h1>

          <p>
            Completa tu información para poder solicitar el alquiler de
            motocicletas dentro de MotoRent.
          </p>
        </header>

        {/* Indicador de pasos */}
        <div className="steps">
          <div className="step-item">
            <div className={`step-circle ${step >= 1 ? "active" : ""}`}>1</div>
            <span>Identidad</span>
          </div>

          <div className={`step-line ${step >= 2 ? "active-line" : ""}`} />

          <div className="step-item">
            <div className={`step-circle ${step >= 2 ? "active" : ""}`}>2</div>
            <span>Licencia</span>
          </div>

          <div className={`step-line ${step >= 3 ? "active-line" : ""}`} />

          <div className="step-item">
            <div className={`step-circle ${step >= 3 ? "active" : ""}`}>3</div>
            <span>Domicilio</span>
          </div>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div className="renter-feedback renter-feedback--error" role="alert">
            {error}
          </div>
        )}
        {exito && (
          <div className="renter-feedback renter-feedback--ok" role="status">
            {exito}
          </div>
        )}

        {/* PASO 1 */}
        {step === 1 && (
          <div className="form-content">
            <div className="section-heading">
              <h2>Identificación personal</h2>
              <p>Necesitamos algunos datos para verificar tu identidad.</p>
            </div>

            <div className="form-group">
              <label htmlFor="cedulaNumero">Número de cédula</label>

              <input
                id="cedulaNumero"
                type="text"
                inputMode="numeric"
                placeholder="Ej: 1023456789"
                value={cedulaNumero}
                onChange={(e) => setCedulaNumero(e.target.value)}
              />
            </div>

            <div className="documents-grid">
              <div className="upload-container">
                <label htmlFor="cedulaFront">
                  <div
                    className={`upload-box ${
                      cedulaFront ? "upload-box--loaded" : ""
                    }`}
                  >
                    <div className="upload-icon">{cedulaFront ? "✓" : "+"}</div>

                    <strong>Cédula frontal</strong>

                    <span>
                      {cedulaFront
                        ? cedulaFront.name
                        : "Sube una fotografía clara"}
                    </span>

                    <small>PNG, JPG o WEBP (máx. 2 MB)</small>
                  </div>
                </label>

                <input
                  id="cedulaFront"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => manejarArchivo(e, setCedulaFront)}
                  hidden
                />
              </div>

              <div className="upload-container">
                <label htmlFor="cedulaBack">
                  <div
                    className={`upload-box ${
                      cedulaBack ? "upload-box--loaded" : ""
                    }`}
                  >
                    <div className="upload-icon">{cedulaBack ? "✓" : "+"}</div>

                    <strong>Cédula posterior</strong>

                    <span>
                      {cedulaBack
                        ? cedulaBack.name
                        : "Sube una fotografía clara"}
                    </span>

                    <small>PNG, JPG o WEBP (máx. 2 MB)</small>
                  </div>
                </label>

                <input
                  id="cedulaBack"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => manejarArchivo(e, setCedulaBack)}
                  hidden
                />
              </div>
            </div>

            <div className="upload-container full-upload">
              <label htmlFor="photo">
                <div
                  className={`upload-box ${photo ? "upload-box--loaded" : ""}`}
                >
                  <div className="upload-icon">{photo ? "✓" : "+"}</div>

                  <strong>Fotografía personal</strong>

                  <span>
                    {photo
                      ? photo.name
                      : "Sube una fotografía reciente donde tu rostro sea claramente visible"}
                  </span>

                  <small>PNG, JPG o WEBP (máx. 2 MB)</small>
                </div>
              </label>

              <input
                id="photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => manejarArchivo(e, setPhoto)}
                hidden
              />
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="form-content">
            <div className="section-heading">
              <h2>Licencia de conducción</h2>

              <p>
                Ingresa la información correspondiente a tu licencia de
                conducción.
              </p>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label htmlFor="licenseNumber">Número de licencia</label>

                <input
                  id="licenseNumber"
                  type="text"
                  placeholder="Número de licencia"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="licenseCategory">Categoría</label>

                <select
                  id="licenseCategory"
                  value={licenseCategory}
                  onChange={(e) =>
                    setLicenseCategory(e.target.value as "" | "A1" | "A2")
                  }
                >
                  <option value="" disabled>
                    Seleccionar
                  </option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="licenseExpirationDate">
                Fecha de vencimiento de la licencia
              </label>

              <input
                id="licenseExpirationDate"
                type="date"
                min={fechaMinima}
                value={licenseExpirationDate}
                onChange={(e) => setLicenseExpirationDate(e.target.value)}
              />
            </div>

            <div className="documents-grid">
              <div className="upload-container">
                <label htmlFor="licenseFront">
                  <div
                    className={`upload-box ${
                      licenseFront ? "upload-box--loaded" : ""
                    }`}
                  >
                    <div className="upload-icon">
                      {licenseFront ? "✓" : "+"}
                    </div>

                    <strong>Licencia frontal</strong>

                    <span>
                      {licenseFront
                        ? licenseFront.name
                        : "Fotografía de la parte frontal"}
                    </span>

                    <small>PNG, JPG o WEBP (máx. 2 MB)</small>
                  </div>
                </label>

                <input
                  id="licenseFront"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => manejarArchivo(e, setLicenseFront)}
                  hidden
                />
              </div>

              <div className="upload-container">
                <label htmlFor="licenseBack">
                  <div
                    className={`upload-box ${
                      licenseBack ? "upload-box--loaded" : ""
                    }`}
                  >
                    <div className="upload-icon">{licenseBack ? "✓" : "+"}</div>

                    <strong>Licencia posterior</strong>

                    <span>
                      {licenseBack
                        ? licenseBack.name
                        : "Fotografía de la parte posterior"}
                    </span>

                    <small>PNG, JPG o WEBP (máx. 2 MB)</small>
                  </div>
                </label>

                <input
                  id="licenseBack"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => manejarArchivo(e, setLicenseBack)}
                  hidden
                />
              </div>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <div className="form-content">
            <div className="section-heading">
              <h2>Comprobante de domicilio</h2>

              <p>Finalmente necesitamos comprobar tu lugar de residencia.</p>
            </div>

            <div className="info-box">
              <span className="info-icon">i</span>

              <div>
                <strong>¿Qué documento puedo utilizar?</strong>

                <p>
                  Puedes adjuntar un recibo reciente de agua, electricidad, gas,
                  internet u otro servicio público.
                </p>
              </div>
            </div>

            <div className="upload-container full-upload bill-upload">
              <label htmlFor="bill">
                <div
                  className={`upload-box ${bill ? "upload-box--loaded" : ""}`}
                >
                  <div className="upload-icon">{bill ? "✓" : "+"}</div>

                  <strong>Comprobante de domicilio</strong>

                  <span>
                    {bill
                      ? bill.name
                      : "Selecciona el recibo desde tu dispositivo"}
                  </span>

                  <small>PNG, JPG, WEBP o PDF (máx. 2 MB)</small>
                </div>
              </label>

              <input
                id="bill"
                type="file"
                accept="image/png,image/jpeg,image/webp,.pdf"
                onChange={(e) => manejarArchivo(e, setBill, true)}
                hidden
              />
            </div>

            <div className="verification-box">
              <div className="verification-icon">✓</div>

              <div>
                <strong>Revisión de información</strong>

                <p>
                  Una vez envíes tu solicitud, tus documentos quedarán
                  pendientes de revisión antes de habilitar las funciones de
                  arrendatario.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <footer className="form-actions">
          <div>
            {step > 1 && (
              <button
                type="button"
                className="back-button"
                onClick={pasoAnterior}
                disabled={enviando}
              >
                Anterior
              </button>
            )}
          </div>

          {step < 3 ? (
            <button
              type="button"
              className="continue-button"
              onClick={siguientePaso}
            >
              Continuar
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              className="continue-button"
              onClick={manejarEnvio}
              disabled={enviando || Boolean(exito)}
            >
              {enviando
                ? "Enviando solicitud..."
                : exito
                ? "Solicitud enviada"
                : "Enviar solicitud"}
            </button>
          )}
        </footer>
      </section>
    </main>
  );
}

export default VerificarRenter;
