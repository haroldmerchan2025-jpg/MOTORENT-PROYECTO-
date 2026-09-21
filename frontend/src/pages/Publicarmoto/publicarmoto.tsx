// frontend/src/pages/PublicarMoto/PublicarMoto.tsx
import "./PublicarMoto.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function PublicarMoto() {

  // ----------------------------------------------------------------------
  // 1. ESTADO DEL FORMULARIO
  // Guarda todos los datos de la moto que el dueño está diligenciando
  // ----------------------------------------------------------------------
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    displacement: "",
    licensePlate: "",
    color: "",
    category: "Uso diario",
    dailyRate: "",
    transitLicenseNumber: "",
    description: "",
  });

  // Estado para saber si el formulario ya se envió exitosamente
  const [publicadoExitoso, setPublicadoExitoso] = useState(false);

  // Manejador para actualizar cualquier campo del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ----------------------------------------------------------------------
  // 2. CÁLCULO DE COMISIÓN Y GANANCIA NETA EN TIEMPO REAL
  // Comisión de la app: 15% | Ganancia para el dueño: 85%
  // ----------------------------------------------------------------------
  const tarifaDiaria = Number(formData.dailyRate) || 0;
  const comisionApp = tarifaDiaria * 0.15;
  const gananciaNetaDueno = tarifaDiaria - comisionApp;

  // ----------------------------------------------------------------------
  // 3. ENVÍO DEL FORMULARIO
  // ----------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.brand || !formData.model || !formData.licensePlate || !formData.dailyRate) {
      alert("Por favor completa los campos obligatorios (*)");
      return;
    }

    // Aquí irá la llamada al backend: POST /api/motos
    setPublicadoExitoso(true);
  };

  return (
    <div className="publish-page">
      {/* NAVBAR SIMPLE CON BOTÓN PARA REGRESAR */}
      <header className="publish-navbar">
        <Link to="/" className="logo">
          <span>MOTO</span>RENT
        </Link>
        <Link to="/motos" className="btn-back">
          ← Volver al catálogo
        </Link>
      </header>

      <main className="publish-container">
        {publicadoExitoso ? (
          /* ============================================================== */
          /* PANTALLA DE ÉXITO TRAS PUBLICAR                                */
          /* ============================================================== */
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2>¡Tu moto ha sido enviada para revisión!</h2>
            <p>
              Registramos tu <strong>{formData.brand} {formData.model}</strong> ({formData.licensePlate.toUpperCase()}).
            </p>
            <div className="review-badge">
              Estado: <span>PENDIENTE DE APROBACIÓN</span>
            </div>
            <p className="review-info">
              Nuestro equipo revisará la tarjeta de propiedad y el SOAT en un lapso de <strong>2 a 4 horas</strong>.
              Una vez aprobada, aparecerá automáticamente en el catálogo público para recibir alquileres.
            </p>
            <div className="success-buttons">
              <Link to="/dashboard" className="btn-primary">
                Ir a mi panel
              </Link>
              <Link to="/motos" className="btn-secondary">
                Ver catálogo
              </Link>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* FORMULARIO DE PUBLICACIÓN                                      */
          /* ============================================================== */
          <div className="publish-card">
            <div className="publish-header">
              <span className="badge-owner">PANEL DE PROPIETARIOS</span>
              <h1>Publica tu moto y comienza a ganar</h1>
              <p>Completa los datos de tu vehículo. Podrás pausar o editar tu publicación cuando quieras.</p>
            </div>

            <form onSubmit={handleSubmit} className="publish-form">
              {/* SECCIÓN 1: DATOS DE LA MOTO */}
              <div className="form-section">
                <h3>1. Información del vehículo</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Marca *</label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="Ej. Yamaha, Honda, Suzuki"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Modelo y Línea *</label>
                    <input
                      type="text"
                      name="model"
                      placeholder="Ej. MT-03, Pulsar NS200"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Año *</label>
                    <input
                      type="number"
                      name="year"
                      min="2010"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cilindraje (cc) *</label>
                    <input
                      type="number"
                      name="displacement"
                      placeholder="Ej. 160, 250, 300"
                      value={formData.displacement}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Placa del vehículo *</label>
                    <input
                      type="text"
                      name="licensePlate"
                      placeholder="Ej. ABC12D"
                      maxLength={6}
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Color *</label>
                    <input
                      type="text"
                      name="color"
                      placeholder="Ej. Negro Mate, Azul"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Categoría recomendada *</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="Uso diario">Uso Diario / Ciudad (Scooters, motos ligeras)</option>
                      <option value="Viaje">Viaje y Turismo (250cc o más, de aventura)</option>
                      <option value="Trabajo">Trabajo y Mensajería (125cc - 150cc de bajo consumo)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: TARIFA Y CALCULADORA DE COMISIÓN */}
              <div className="form-section">
                <h3>2. Tarifa y ganancias</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>¿Cuánto quieres cobrar por día? (COP) *</label>
                    <input
                      type="number"
                      name="dailyRate"
                      placeholder="Ej. 50000"
                      step="1000"
                      min="20000"
                      value={formData.dailyRate}
                      onChange={handleChange}
                      required
                    />
                    <small className="input-hint">El precio promedio en plataforma suele estar entre $35.000 y $90.000 COP/día.</small>
                  </div>
                </div>

                {/* CAJA DE CÁLCULO DE GANANCIAS EN VIVO */}
                {tarifaDiaria > 0 && (
                  <div className="earnings-preview">
                    <div className="earnings-row">
                      <span>Tarifa cobrada al cliente:</span>
                      <span>${tarifaDiaria.toLocaleString("es-CO")} COP</span>
                    </div>
                    <div className="earnings-row fee">
                      <span>Comisión de servicio MotoRent (15%):</span>
                      <span>- ${comisionApp.toLocaleString("es-CO")} COP</span>
                    </div>
                    <div className="earnings-divider"></div>
                    <div className="earnings-row net">
                      <span>Tu ganancia neta por día:</span>
                      <strong className="net-amount">${gananciaNetaDueno.toLocaleString("es-CO")} COP</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 3: DOCUMENTOS Y VERIFICACIÓN */}
              <div className="form-section">
                <h3>3. Documentos obligatorios (Colombia)</h3>
                <p className="section-note">Estos documentos son confidenciales y solo los verá el equipo de verificación.</p>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Número de Licencia de Tránsito (Tarjeta de Propiedad) *</label>
                    <input
                      type="text"
                      name="transitLicenseNumber"
                      placeholder="Número que aparece en la tarjeta"
                      value={formData.transitLicenseNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Foto de Tarjeta de Propiedad *</label>
                    <input type="file" accept="image/*,.pdf" className="file-input" />
                  </div>

                  <div className="form-group full-width">
                    <label>Foto de la moto (Para el catálogo) *</label>
                    <input type="file" accept="image/*" className="file-input" />
                    <small className="input-hint">Sube una foto clara y bien iluminada de tu moto de perfil.</small>
                  </div>
                </div>
              </div>

              {/* BOTÓN SUBMIT */}
              <div className="form-actions">
                <button type="submit" className="btn-submit-moto">
                  Enviar moto a revisión
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default PublicarMoto;