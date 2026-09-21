// frontend/src/pages/Contrato/Contrato.tsx
import { useNavigate } from "react-router-dom";
import "./Contrato.css";

export default function Contrato() {
  const navigate = useNavigate();

  return (
    <div className="contrato-page">
      <div className="contrato-container">
        
        {/* Barra superior de navegación */}
        <div className="contrato-top-bar">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Volver al Dashboard
          </button>
          <span className="badge-status">Pendiente de Aprobación</span>
        </div>

        {/* Resumen rápido de las partes y vehículo */}
        <div className="contrato-summary-bar">
          <div className="summary-col">
            <h5>Vehículo</h5>
            <p>Yamaha MT-03 (KTM-45G)</p>
          </div>
          <div className="summary-col">
            <h5>Arrendador (Dueño)</h5>
            <p>Harold Merchán</p>
          </div>
          <div className="summary-col">
            <h5>Arrendatario (Cliente)</h5>
            <p>Juan Camilo Ospina</p>
          </div>
          <div className="summary-col">
            <h5>Referencia</h5>
            <p>#CTR-2026-0842</p>
          </div>
        </div>

        {/* Visor / Contenedor del Contrato */}
        <div className="contrato-viewer-card">
          <div className="contrato-viewer-header">
            <h3>Documento de Contrato de Renta</h3>
          </div>

          {/* ========================================================================= */}
          {/*   ESPACIO RESERVADO PARA INSERTAR EL CONTRATO (PDF, HTML O COMPONENTE)   */}
          {/* ========================================================================= */}
          <div className="contrato-document-slot">
            
            {/* Aquí puedes reemplazar este bloque cuando tengas el contrato listo */}
            <div className="contrato-placeholder">
              <div className="placeholder-icon">📄</div>
              <h4>Espacio para el Contrato</h4>
              <p>
                Aquí se renderizará el contenido del contrato oficial antes de formalizar la renta.
              </p>
              <code>&lt;!-- Inserta tu componente, PDF o texto legal aquí --&gt;</code>
            </div>

          </div>

          {/* Barra inferior de acciones */}
          <div className="contrato-footer-actions">
            <div className="delivery-notice">
              <span>📩</span>
              <p>
                Al formalizar, el contrato firmado se enviará automáticamente al arrendador y al arrendatario.
              </p>
            </div>

            <div className="actions-buttons">
              <button 
                type="button" 
                className="btn-action-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Rechazar / Cancelar
              </button>
              <button 
                type="button" 
                className="btn-action-primary"
                onClick={() => alert("Próximamente: confirmación y envío de contrato")}
              >
                Aceptar y Confirmar Renta
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}