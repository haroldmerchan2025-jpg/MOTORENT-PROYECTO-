import "./Home.css";
import moto1 from "../../assets/imagenes/moto1.jpeg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <header className="navbar">

        <div className="logo">
          <span>MOTO</span>RENT
        </div>

        <nav className="nav-links">
          <a href="/">Inicio</a>
          <Link to="/motos">Motos</Link>
          <a href="#nosotros">Nosotros</a>
        </nav>

        <div className="nav-buttons">
          <a href="/login" className="btn-login">
            Iniciar sesión
          </a>

          <a href="/register" className="btn-register">
            Registrarse
          </a>
        </div>

      </header>

      <main>

        <section className="hero">

          <div className="hero-content">

            <p className="hero-tag">
              ALQUILER DE MOTOCICLETAS
            </p>

            <h1>
              Alquila tu moto.
              <br />
              <span>Comienza el viaje.</span>
            </h1>

            <p className="hero-description">
              Encuentra la motocicleta perfecta para moverte
              de forma rápida, cómoda y segura.
            </p>

            <a href="#motos" className="hero-button">
              Ver motocicletas
            </a>

          </div>

          <div className="hero-image">
            <img src={moto1} alt="Motocicleta MOTORENT" />
          </div>

        </section>

        <section className="categories">

          <div className="category-card">
            <h3>Viaje</h3>
            <p>Motos de aventura por días o semanas.</p>
          </div>

          <div className="category-card">
            <h3>Uso diario</h3>
            <p>Movilidad flexible para el día a día.</p>
          </div>

          <div className="category-card">
            <h3>Trabajo</h3>
            <p>Ideal para domicilios y mensajería.</p>
          </div>

        </section>

        <section className="how-it-works">
  <h2>Cómo funciona</h2>

  <div className="steps">
    <div className="step">
      <span className="step-number">1</span>
      <h4>Buscas tu moto</h4>
      <p>Elige entre nuestro catálogo según tu necesidad.</p>
    </div>

    <div className="step">
      <span className="step-number">2</span>
      <h4>Reservas</h4>
      <p>Confirma fechas y sube tus documentos.</p>
    </div>

    <div className="step">
      <span className="step-number">3</span>
      <h4>Recoges y disfrutas</h4>
      <p>Firmamos el contrato y te entregamos la moto.</p>
    </div>
  </div>
</section>

<footer className="footer">
  <div className="footer-logo">
    <span>MOTO</span>RENT
  </div>
  <p className="footer-text">© 2026 MotoRent. Todos los derechos reservados.</p>
  <div className="footer-links">
    <a href="#nosotros">Nosotros</a>
    <a href="#contacto">Contacto</a>
    <a href="#terminos">Términos y condiciones</a>
  </div>
</footer>

      </main>

    </div>
  );
}

export default Home;