import "./Home.css";
import moto1 from "../../assets/motos/moto1.jpeg";

function Home() {
  return (
    <div className="home">

      <header className="navbar">

        <div className="logo">
          <span>MOTO</span>RENT
        </div>

        <nav className="nav-links">
          <a href="/">Inicio</a>
          <a href="#motos">Motos</a>
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

      </main>

    </div>
  );
}

export default Home;