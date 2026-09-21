import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import "../Login/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    if (!email.trim() || !email.includes("@")) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ocurrió un error al procesar la solicitud");
        setCargando(false);
        return;
      }

      setMensajeExito(
        data.message || "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
      );
      setCargando(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor backend.");
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <Link to="/login" className="auth-back-link">
        ← Volver al login
      </Link>

      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="MotoRent" className="auth-logo" />
          <span className="auth-brand-name">
            <span>MOTO</span>RENT
          </span>
        </div>

        <h1>Recuperar contraseña</h1>
        <p className="auth-subtitle">
          Ingresa el correo asociado a tu cuenta y te enviaremos un enlace de restablecimiento.
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        {mensajeExito ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>
            <div
              style={{
                backgroundColor: "rgba(52, 211, 153, 0.12)",
                border: "1px solid #34D399",
                borderRadius: "10px",
                padding: "16px",
                color: "#34D399",
                fontSize: "14px",
                lineHeight: "1.5",
                marginBottom: "24px",
              }}
            >
              {mensajeExito}
            </div>
            <p style={{ color: "#7A8E9F", fontSize: "13px", marginBottom: "24px" }}>
              💡 Revisa tu bandeja de entrada o carpeta de spam. (Si estás probando en desarrollo, mira la terminal del backend).
            </p>
            <Link to="/login" className="auth-button" style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
              Volver a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="ej. tunombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={cargando}>
              {cargando ? "Enviando enlace..." : "Enviar enlace de recuperación"}
            </button>

            <p className="auth-switch">
              ¿Recordaste tu contraseña? <Link to="/login">Inicia sesión</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
