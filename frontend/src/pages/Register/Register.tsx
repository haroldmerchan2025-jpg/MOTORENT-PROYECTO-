import { useState } from "react";

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

function handleSubmit(e: React.FormEvent) {
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

  console.log({
    NombreCompleto,
    usuario,
    correo,
    password,
  });
}

  return (
    <div>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre Completo</label>
          <input
            type="text"
            value={NombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
          />
          {errorNombreCompleto && <p>{errorNombreCompleto}</p>}
        </div>

        <div>
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          {errorUsuario && <p>{errorUsuario}</p>}
        </div>

        <div>
          <label>Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          {errorCorreo && <p>{errorCorreo}</p>}
        </div>

        <div>
          <label>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          {errorTelefono && <p>{errorTelefono}</p>}
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
 {password.length > 0 && (
  <div>
    <p>La contraseña debe cumplir:</p>

    <p>
      {requisitosPassword.longitud ? "✓" : "✗"} Entre 8 y 16 caracteres
    </p>

    <p>
      {requisitosPassword.mayuscula ? "✓" : "✗"} Una letra mayúscula
    </p>

    <p>
      {requisitosPassword.minuscula ? "✓" : "✗"} Una letra minúscula
    </p>

    <p>
      {requisitosPassword.numero ? "✓" : "✗"} Un número
    </p>

    <p>
      {requisitosPassword.especial ? "✓" : "✗"} Un carácter especial
    </p>

    
  </div>
)}
            {errorPassword && <p>{errorPassword}</p>}

        </div>

        <div>
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errorConfirmPassword && <p>{errorConfirmPassword}</p>}
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;