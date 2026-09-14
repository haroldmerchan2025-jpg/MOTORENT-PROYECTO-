import "./Login.css";
import logo from "../../assets/logo/logo.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [errorUsuario, setErrorUsuario] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorUsuario("");
    setErrorPassword("");
    setApiError("");

    let formularioValido = true;

    navigate("/dashboard", { replace: true });

    if (usuario.trim() === "") {
      setErrorUsuario("El usuario o correo es obligatorio");
      formularioValido = false;
    }

    if (password.trim() === "") {
      setErrorPassword("La contraseña es obligatoria");
      formularioValido = false;
    }

    if (!formularioValido) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: usuario,
          password: password,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        setApiError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
  console.error(error);
  setApiError("No se pudo conectar con el servidor. Intenta de nuevo.");
}
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <img src={logo} alt="MotoRent" className="auth-logo-placeholder" />
          <span className="auth-brand-name"><span>MOTO</span>RENT</span>
        </div>

        <h1>Iniciar sesión</h1>

        {apiError && <p className="auth-error">{apiError}</p>}

        <div className="form-field">
          <label>Usuario o correo</label>

          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          {errorUsuario && <p className="field-error">{errorUsuario}</p>}
        </div>

        <div className="form-field">
          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorPassword && <p className="field-error">{errorPassword}</p>}
        </div>

        <button type="submit" className="auth-button">
          Ingresar
        </button>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;