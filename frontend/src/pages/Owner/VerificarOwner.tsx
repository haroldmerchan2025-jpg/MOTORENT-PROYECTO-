import { useState, type ChangeEvent } from "react";
import {
  enviarSolicitudOwner,
  validarArchivoBasico,
} from "../../services/perfilSolicitud.service";
import "./VerificarOwner.css";

function VerificarOwner() {
  const [step, setStep] = useState(1);

  // Datos del formulario
  const [cedulaNumero, setCedulaNumero] = useState("");
  const [cedulaFront, setCedulaFront] = useState<File | null>(null);
  const [cedulaBack, setCedulaBack] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [bill, setBill] = useState<File | null>(null);

  // Estados de envío y mensajes al usuario
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  // Guarda el archivo elegido solo si pasa la validación de formato y tamaño
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

    if (!cedulaFront || !cedulaBack || !photo || !bill) {
      setError("Debes adjuntar el comprobante de domicilio antes de enviar.");
      return;
    }

    setEnviando(true);
    const resultado = await enviarSolicitudOwner({
      cedulaNumero,
      cedulaFront,
      cedulaBack,
      photo,
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
    <main className="owner-page">
      <section className="owner-card">
        {/* Encabezado */}
        <header className="owner-header">
          <span className="owner-tag">MOTORENT</span>

          <h1>Verificación de propietario</h1>

          <p>
            Completa tu información para poder publicar motocicletas dentro de
            MotoRent.
          </p>
        </header>

        {/* Pasos */}
        <div className="owner-steps">
          <div className="owner-step-item">
            <div className={`owner-step-circle ${step >= 1 ? "active" : ""}`}>
              1
            </div>

            <span>Identidad</span>
          </div>

          <div className={`owner-step-line ${step >= 2 ? "active-line" : ""}`} />

          <div className="owner-step-item">
            <div className={`owner-step-circle ${step >= 2 ? "active" : ""}`}>
              2
            </div>

            <span>Domicilio</span>
          </div>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div className="owner-feedback owner-feedback--error" role="alert">
            {error}
          </div>
        )}
        {exito && (
          <div className="owner-feedback owner-feedback--ok" role="status">
            {exito}
          </div>
        )}

        {/* ========================= */}
        {/* PASO 1 */}
        {/* ========================= */}

        {step === 1 && (
          <div className="owner-form-content">
            <div className="owner-section-heading">
              <h2>Identificación personal</h2>

              <p>
                Necesitamos verificar tu identidad antes de permitir la
                publicación de motocicletas.
              </p>
            </div>

            <div className="owner-form-group">
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

            <div className="owner-documents-grid">
              {/* Cédula frontal */}
              <div className="owner-upload-container">
                <label htmlFor="cedulaFront">
                  <div
                    className={`owner-upload-box ${
                      cedulaFront ? "owner-upload-box--loaded" : ""
                    }`}
                  >
                    <div className="owner-upload-icon">
                      {cedulaFront ? "✓" : "+"}
                    </div>

                    <strong>Cédula frontal</strong>

                    <span>
                      {cedulaFront
                        ? cedulaFront.name
                        : "Fotografía clara de la parte frontal"}
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

              {/* Cédula posterior */}
              <div className="owner-upload-container">
                <label htmlFor="cedulaBack">
                  <div
                    className={`owner-upload-box ${
                      cedulaBack ? "owner-upload-box--loaded" : ""
                    }`}
                  >
                    <div className="owner-upload-icon">
                      {cedulaBack ? "✓" : "+"}
                    </div>

                    <strong>Cédula posterior</strong>

                    <span>
                      {cedulaBack
                        ? cedulaBack.name
                        : "Fotografía clara de la parte posterior"}
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

            {/* Fotografía personal */}
            <div className="owner-upload-container owner-full-upload">
              <label htmlFor="photo">
                <div
                  className={`owner-upload-box ${
                    photo ? "owner-upload-box--loaded" : ""
                  }`}
                >
                  <div className="owner-upload-icon">{photo ? "✓" : "+"}</div>

                  <strong>Fotografía personal</strong>

                  <span>
                    {photo
                      ? photo.name
                      : "Sube una fotografía reciente donde tu rostro sea claramente visible."}
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

        {/* ========================= */}
        {/* PASO 2 */}
        {/* ========================= */}

        {step === 2 && (
          <div className="owner-form-content">
            <div className="owner-section-heading">
              <h2>Comprobante de domicilio</h2>

              <p>
                Adjunta un documento reciente que permita comprobar tu lugar de
                residencia.
              </p>
            </div>

            <div className="owner-info-box">
              <span className="owner-info-icon">i</span>

              <div>
                <strong>¿Qué documento puedo utilizar?</strong>

                <p>
                  Puedes subir un recibo reciente de agua, electricidad, gas,
                  internet u otro servicio público.
                </p>
              </div>
            </div>

            {/* Recibo */}
            <div className="owner-upload-container owner-full-upload">
              <label htmlFor="bill">
                <div
                  className={`owner-upload-box ${
                    bill ? "owner-upload-box--loaded" : ""
                  }`}
                >
                  <div className="owner-upload-icon">{bill ? "✓" : "+"}</div>

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

            {/* Aviso */}
            <div className="owner-verification-box">
              <div className="owner-verification-icon">✓</div>

              <div>
                <strong>Verificación de propietario</strong>

                <p>
                  Tu información será revisada antes de habilitar las funciones
                  necesarias para publicar motocicletas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <footer className="owner-actions">
          <div>
            {step > 1 && (
              <button
                type="button"
                className="owner-back-button"
                onClick={pasoAnterior}
                disabled={enviando}
              >
                Anterior
              </button>
            )}
          </div>

          {step < 2 ? (
            <button
              type="button"
              className="owner-continue-button"
              onClick={siguientePaso}
            >
              Continuar
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              className="owner-continue-button"
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

export default VerificarOwner;
