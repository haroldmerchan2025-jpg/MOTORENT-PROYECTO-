import { useState } from "react";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [errorUsuario, setErrorUsuario] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorUsuario("");
    setErrorPassword("");

    let formularioValido = true;

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

    console.log({
      usuario,
      password,
    });
  }

  return (
    <div>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario o correo</label>

          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          {errorUsuario && <p>{errorUsuario}</p>}
        </div>

        <div>
          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorPassword && <p>{errorPassword}</p>}
        </div>

        <button type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;