import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import "../Login/Login.css";

function VerificarCorreo() {
  const { token } = useParams<{ token: string }>();
  const [estado, setEstado] = useState<"cargando" | "exito" | "error">(!token ? "error" : "cargando");
  const [mensaje, setMensaje] = useState(!token ? "No se proporcionó ningún código de verificación en el enlace." : "");
  const peticionEnviada = useRef(false);

  useEffect(() => {
    if (!token || peticionEnviada.current) return;
    peticionEnviada.current = true;

    // Llamamos al endpoint GET /auth/verify-email/:token una sola vez
    fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.ok) {
          setEstado("exito");
          setMensaje(data.message || "¡Tu correo ha sido verificado con éxito!");
        } else {
          setEstado("error");
          setMensaje(data.message || "El enlace de verificación es inválido o ha expirado.");
        }
      })
      .catch((err) => {
        console.error(err);
        setEstado("error");
        setMensaje("No se pudo conectar con el servidor para verificar tu correo.");
      });
  }, [token]);

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-link">
        ← Volver al inicio
      </Link>

      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-brand">
          <img src={logo} alt="MotoRent" className="auth-logo" />
          <span className="auth-brand-name">
            <span>MOTO</span>RENT
          </span>
        </div>

        {/* 1. ESTADO: CARGANDO */}
        {estado === "cargando" && (
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>⏳</div>
            <h2>Verificando tu correo...</h2>
            <p style={{ color: "#7A8E9F", fontSize: "14px", marginTop: "8px" }}>
              Espera un momento mientras confirmamos tu cuenta en MotoRent.
            </p>
          </div>
        )}

        {/* 2. ESTADO: ÉXITO */}
        {estado === "exito" && (
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ color: "#34D399" }}>¡Correo Verificado!</h2>
            <div
              style={{
                backgroundColor: "rgba(52, 211, 153, 0.12)",
                border: "1px solid #34D399",
                borderRadius: "10px",
                padding: "16px",
                color: "#34D399",
                fontSize: "14px",
                margin: "20px 0",
              }}
            >
              {mensaje}
            </div>
            <p style={{ color: "#CBD5E0", fontSize: "14px", marginBottom: "28px" }}>
              Tu cuenta de MotoRent ya está activa. Ahora puedes alquilar cualquier moto disponible o publicar las tuyas.
            </p>
            <Link
              to="/login"
              className="auth-button"
              style={{ display: "block", textDecoration: "none", textAlign: "center" }}
            >
              Iniciar sesión en MotoRent
            </Link>
          </div>
        )}

        {/* 3. ESTADO: ERROR O EXPIRADO */}
        {estado === "error" && (
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ color: "#EF4444" }}>No pudimos verificar tu correo</h2>
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid #EF4444",
                borderRadius: "10px",
                padding: "16px",
                color: "#FCA5A5",
                fontSize: "14px",
                margin: "20px 0",
              }}
            >
              {mensaje}
            </div>
            <p style={{ color: "#7A8E9F", fontSize: "13px", marginBottom: "28px" }}>
              Por seguridad, los enlaces de verificación vencen después de 24 horas. Si ya tienes cuenta, inicia sesión y solicita un nuevo enlace desde tu perfil.
            </p>
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <Link
                to="/login"
                className="auth-button"
                style={{ display: "block", textDecoration: "none", textAlign: "center" }}
              >
                Ir a Iniciar Sesión
              </Link>
              <Link
                to="/"
                style={{ color: "#7A8E9F", fontSize: "13px", textDecoration: "none" }}
              >
                Volver a la página principal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificarCorreo;
