import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import "../Register/Register.css";

function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [apiError, setApiError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  // Validación de requisitos de seguridad en tiempo real
  const requisitos = {
    longitud: password.length >= 8 && password.length <= 16,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /[0-9]/.test(password),
    especial: /[#$%&@?¿/!¡]/.test(password),
  };

  const passwordValida = Object.values(requisitos).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorPassword("");
    setErrorConfirm("");
    setApiError("");

    if (!token) {
      setApiError("El enlace de recuperación es inválido o no contiene un token.");
      return;
    }

    if (!passwordValida) {
      setErrorPassword("La contraseña debe cumplir todos los requisitos de seguridad.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorConfirm("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "No se pudo restablecer la contraseña.");
        setCargando(false);
        return;
      }

      setExito(true);
      setCargando(false);
    } catch (err) {
      console.error(err);
      setApiError("Error al conectar con el servidor backend.");
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

        <h1>Nueva contraseña</h1>
        <p className="auth-subtitle">Escribe tu nueva contraseña para recuperar el acceso a tu cuenta.</p>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        {exito ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>🎉</div>
            <div
              style={{
                backgroundColor: "rgba(52, 211, 153, 0.12)",
                border: "1px solid #34D399",
                borderRadius: "10px",
                padding: "16px",
                color: "#34D399",
                fontSize: "15px",
                fontWeight: "600",
                lineHeight: "1.5",
                marginBottom: "24px",
              }}
            >
              ¡Contraseña restablecida exitosamente!
            </div>
            <p style={{ color: "#7A8E9F", fontSize: "14px", marginBottom: "28px" }}>
              Ya puedes iniciar sesión con tus nuevas credenciales en cualquier momento.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="auth-button"
              style={{ width: "100%" }}
            >
              Iniciar sesión ahora
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* NUEVA CONTRASEÑA */}
            <div className="form-field">
              <label>Nueva contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Escribe tu nueva clave"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", paddingRight: "40px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {mostrarPassword ? "👁️" : "🙈"}
                </button>
              </div>
              {errorPassword && <p className="field-error">{errorPassword}</p>}
            </div>

            {/* REQUISITOS EN VIVO */}
            <div className="password-requirements">
              <p className="password-requirements-title">Tu contraseña debe tener:</p>
              <div className="req-grid">
                <span className={requisitos.longitud ? "req-ok" : "req-pending"}>
                  {requisitos.longitud ? "✓" : "○"} 8 a 16 caracteres
                </span>
                <span className={requisitos.mayuscula ? "req-ok" : "req-pending"}>
                  {requisitos.mayuscula ? "✓" : "○"} Una mayúscula
                </span>
                <span className={requisitos.minuscula ? "req-ok" : "req-pending"}>
                  {requisitos.minuscula ? "✓" : "○"} Una minúscula
                </span>
                <span className={requisitos.numero ? "req-ok" : "req-pending"}>
                  {requisitos.numero ? "✓" : "○"} Un número
                </span>
                <span className={requisitos.especial ? "req-ok" : "req-pending"}>
                  {requisitos.especial ? "✓" : "○"} Un símbolo (#$%&@?¿/!¡)
                </span>
              </div>
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div className="form-field">
              <label>Confirmar nueva contraseña</label>
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="Repite la nueva clave"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errorConfirm && <p className="field-error">{errorConfirm}</p>}
            </div>

            <button type="submit" className="auth-button" disabled={cargando}>
              {cargando ? "Actualizando contraseña..." : "Restablecer contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
