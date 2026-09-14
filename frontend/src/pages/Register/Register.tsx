import "./Register.css";
import logo from "../../assets/logo/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [NombreCompleto, setNombreCompleto] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorNombreCompleto, setErrorNombreCompleto] = useState("");
  const [errorUsuario, setErrorUsuario] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

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
  setErrorPassword("");
  setErrorConfirmPassword("");

  let formularioValido = true;

  // Nombre Completo
  if (NombreCompleto.trim() === "") {
    setErrorNombreCompleto("El nombre completo es obligatorio");
    formularioValido = false;
  }


  // Usuario
  if (usuario.trim() === "") {
    setErrorUsuario("El usuario es obligatorio");
    formularioValido = false;
  }

  // Correo
  if (correo.trim() === "") {
    setErrorCorreo("El correo es obligatorio");
    formularioValido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    setErrorCorreo("Ingresa un correo válido");
    formularioValido = false;
  }

  // Teléfono
  if (telefono.trim() === "") {
    setErrorTelefono("El teléfono es obligatorio");
    formularioValido = false;
  } else if (!/^\d{10,15}$/.test(telefono)) {
    setErrorTelefono("Ingresa un numero de telefono valido entre 10 y 15 digitos");
    formularioValido = false;
  }

  // Contraseña
  if (password.trim() === "") {
  setErrorPassword("La contraseña es obligatoria");
  formularioValido = false;
} else if (!passwordValida) {
  setErrorPassword("La contraseña no cumple todos los requisitos");
  formularioValido = false;
}

  // Confirmar contraseña
  if (confirmPassword.trim() === "") {
    setErrorConfirmPassword(
      "Debes confirmar la contraseña"
    );
    formularioValido = false;
  } else if (password !== confirmPassword) {
    setErrorConfirmPassword(
      "Las contraseñas no coinciden"
    );
    formularioValido = false;
  }

  if (!formularioValido) {
    return;
  }

  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: usuario,
      email: correo,
      password: password,
      fullName: NombreCompleto,
      phone: telefono
    })
  });

  const data = await response.json();

  console.log(response.status);
  console.log(data);
}

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>

        <div className="auth-brand">
          <img src={logo} alt="MotoRent" className="auth-logo-placeholder" />
          <span className="auth-brand-name"><span>MOTO</span>RENT</span>
        </div>

        <h1>Registro</h1>

        <div className="form-field">
          <label>Nombre Completo</label>
          <input
            type="text"
            value={NombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
          />
          {errorNombreCompleto && <p className="field-error">{errorNombreCompleto}</p>}
        </div>

        <div className="form-field">
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          {errorUsuario && <p className="field-error">{errorUsuario}</p>}
        </div>

        <div className="form-field">
          <label>Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          {errorCorreo && <p className="field-error">{errorCorreo}</p>}
        </div>

        <div className="form-field">
          <label>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onBlur={()=> {
              if(telefono.length !== 10){
                setErrorTelefono("El numero de telefono debe tener 10 digitos");
            }else{
              setErrorTelefono("")
            }
            }}
          />
          {errorTelefono && <p className="field-error">{errorTelefono}</p>}
        </div>

        <div className="form-field">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {password.length > 0 && (
            <div className="password-requirements">
              <p className="password-requirements-title">La contraseña debe cumplir:</p>

              <p className={requisitosPassword.longitud ? "req-ok" : "req-pending"}>
                {requisitosPassword.longitud ? "✓" : "✗"} Entre 8 y 16 caracteres
              </p>

              <p className={requisitosPassword.mayuscula ? "req-ok" : "req-pending"}>
                {requisitosPassword.mayuscula ? "✓" : "✗"} Una letra mayúscula
              </p>

              <p className={requisitosPassword.minuscula ? "req-ok" : "req-pending"}>
                {requisitosPassword.minuscula ? "✓" : "✗"} Una letra minúscula
              </p>

              <p className={requisitosPassword.numero ? "req-ok" : "req-pending"}>
                {requisitosPassword.numero ? "✓" : "✗"} Un número
              </p>

              <p className={requisitosPassword.especial ? "req-ok" : "req-pending"}>
                {requisitosPassword.especial ? "✓" : "✗"} Un carácter especial
              </p>
            </div>
          )}
          {errorPassword && <p className="field-error">{errorPassword}</p>}
        </div>

        <div className="form-field">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errorConfirmPassword && <p className="field-error">{errorConfirmPassword}</p>}
        </div>

        <button type="submit" className="auth-button">Registrarse</button>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

      </form>
    </div>
  );
}

export default Register;