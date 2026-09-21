import "./Register.css";
import logo from "../../assets/logo/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // Campos
  const [NombreCompleto, setNombreCompleto] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Errores
  const [errorNombreCompleto, setErrorNombreCompleto] = useState("");
  const [errorUsuario, setErrorUsuario] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Validación de requisitos de contraseña
  const requisitosPassword = {
    longitud: password.length >= 8 && password.length <= 16,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /[0-9]/.test(password),
    especial: /[^A-Za-z0-9]/.test(password),
  };

  const passwordValida = Object.values(requisitosPassword).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorNombreCompleto("");
    setErrorUsuario("");
    setErrorCorreo("");
    setErrorTelefono("");
    setErrorPassword("");
    setErrorConfirmPassword("");
    setApiError("");

    let formularioValido = true;

    if (NombreCompleto.trim() === "") {
      setErrorNombreCompleto("El nombre completo es obligatorio");
      formularioValido = false;
    }

    if (usuario.trim() === "") {
      setErrorUsuario("El usuario es obligatorio");
      formularioValido = false;
    }

    if (correo.trim() === "") {
      setErrorCorreo("El correo es obligatorio");
      formularioValido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setErrorCorreo("Ingresa un correo válido");
      formularioValido = false;
    }

    if (telefono.trim() === "") {
      setErrorTelefono("El teléfono es obligatorio");
      formularioValido = false;
    } else if (telefono.length !== 10) {
      setErrorTelefono("El número debe tener 10 dígitos");
      formularioValido = false;
    }

    if (password.trim() === "") {
      setErrorPassword("La contraseña es obligatoria");
      formularioValido = false;
    } else if (!passwordValida) {
      setErrorPassword("La contraseña no cumple todos los requisitos");
      formularioValido = false;
    }

    if (confirmPassword.trim() === "") {
      setErrorConfirmPassword("Debes confirmar la contraseña");
      formularioValido = false;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword("Las contraseñas no coinciden");
      formularioValido = false;
    }

    if (!formularioValido) return;

    setCargando(true);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usuario,
          email: correo,
          password: password,
          fullName: NombreCompleto,
          phone: telefono,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "Error al registrar usuario");
        setCargando(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/motos", { replace: true });
    } catch (error) {
      console.error(error);
      setApiError("No se pudo conectar con el servidor backend.");
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-link">
        ← Volver al inicio
      </Link>

      <form className="auth-card register-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <img src={logo} alt="MotoRent" className="auth-logo" />
          <span className="auth-brand-name">
            <span>MOTO</span>RENT
          </span>
        </div>

        <h1>Crea tu cuenta</h1>
        <p className="auth-subtitle">Renta motos o publica la tuya en minutos</p>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        <div className="form-field">
          <label>Nombre Completo *</label>
          <input
            type="text"
            placeholder="ej. Harold Merchán"
            value={NombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
          />
          {errorNombreCompleto && <p className="field-error">{errorNombreCompleto}</p>}
        </div>

        <div className="form-grid-two">
          <div className="form-field">
            <label>Usuario *</label>
            <input
              type="text"
              placeholder="ej. haroldm"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            {errorUsuario && <p className="field-error">{errorUsuario}</p>}
          </div>

          <div className="form-field">
            <label>Teléfono (10 dígitos) *</label>
            <input
              type="text"
              placeholder="3001234567"
              maxLength={10}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {errorTelefono && <p className="field-error">{errorTelefono}</p>}
          </div>
        </div>

        <div className="form-field">
          <label>Correo electrónico *</label>
          <input
            type="email"
            placeholder="harold@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          {errorCorreo && <p className="field-error">{errorCorreo}</p>}
        </div>

        <div className="form-grid-two">
          <div className="form-field">
            <label>Contraseña *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorPassword && <p className="field-error">{errorPassword}</p>}
          </div>

          <div className="form-field">
            <label>Confirmar contraseña *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorConfirmPassword && <p className="field-error">{errorConfirmPassword}</p>}
          </div>
        </div>

        {/* Indicadores visuales de requisitos de contraseña */}
        {password.length > 0 && (
          <div className="password-requirements">
            <p className="password-requirements-title">Requisitos de contraseña:</p>
            <div className="req-grid">
              <span className={requisitosPassword.longitud ? "req-ok" : "req-pending"}>
                {requisitosPassword.longitud ? "✓" : "○"} 8-16 caracteres
              </span>
              <span className={requisitosPassword.mayuscula ? "req-ok" : "req-pending"}>
                {requisitosPassword.mayuscula ? "✓" : "○"} 1 Mayúscula
              </span>
              <span className={requisitosPassword.minuscula ? "req-ok" : "req-pending"}>
                {requisitosPassword.minuscula ? "✓" : "○"} 1 Minúscula
              </span>
              <span className={requisitosPassword.numero ? "req-ok" : "req-pending"}>
                {requisitosPassword.numero ? "✓" : "○"} 1 Número
              </span>
              <span className={requisitosPassword.especial ? "req-ok" : "req-pending"}>
                {requisitosPassword.especial ? "✓" : "○"} 1 Carácter especial
              </span>
            </div>
          </div>
        )}

        <button type="submit" className="auth-button" disabled={cargando}>
          {cargando ? "Creando cuenta..." : "Crear mi cuenta"}
        </button>

        <p className="auth-switch">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;