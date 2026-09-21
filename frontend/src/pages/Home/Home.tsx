import "./Home.css";
import moto1 from "../../assets/imagenes/moto1.jpeg";
import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="home">

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content">
            <span className="hero-badge">RENTING INTELIGENTE EN COLOMBIA</span>
            <h1>
              Alquila tu moto.
              <br />
              <span>Comienza el viaje.</span>
            </h1>
            <p className="hero-description">
              Muévete por la ciudad o sal de ruta sin ataduras. Alquila motocicletas
              verificadas por días o semanas, o publica la tuya y genera ingresos extra.
            </p>

            <div className="hero-cta-group">
              <Link to="/motos" className="btn-primary-cta">
                Ver motocicletas disponibles
              </Link>
              <a href="#propietarios" className="btn-secondary-cta">
                Quiero rentar mi moto
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <strong>+100%</strong>
                <span>Motos verificadas</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>Sin complicaciones</strong>
                <span>Proceso 100% digital</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>Tarifas claras</strong>
                <span>Sin costos ocultos</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img src={moto1} alt="Motocicleta MotoRent" />
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="section-categories">
          <div className="section-header">
            <h2>Motos para cada momento</h2>
            <p>Elige el tipo de vehículo según tu necesidad</p>
          </div>

          <div className="categories-grid">
            <Link to="/motos" className="category-card travel">
              <div className="category-tag">Aventura</div>
              <h3>Viaje y Turismo</h3>
              <p>Altas cilindradas con maleteros listas para devorar carretera con total comodidad.</p>
              <span className="card-link">Explorar categoría →</span>
            </Link>

            <Link to="/motos" className="category-card daily">
              <div className="category-tag">Ciudad</div>
              <h3>Uso Diario</h3>
              <p>Scooters y motos livianas, ideales para esquivar el tráfico diario y ahorrar gasolina.</p>
              <span className="card-link">Explorar categoría →</span>
            </Link>

            <Link to="/motos" className="category-card work">
              <div className="category-tag">Productividad</div>
              <h3>Trabajo</h3>
              <p>Motos resistentes, económicas y listas para mensajería o jornadas exigentes.</p>
              <span className="card-link">Explorar categoría →</span>
            </Link>
          </div>
        </section>

        {/* SECCIÓN PROPIETARIOS / DUEÑOS (NUEVO ROL) */}
        <section id="propietarios" className="section-owner-banner">
          <div className="owner-banner-inner">
            <div className="owner-text">
              <span className="badge-highlight">GANA DINERO CON MOTORENT</span>
              <h2>¿Tienes una moto parada? Ponla a generar ingresos</h2>
              <p>
                Conviértete en anfitrión en nuestra plataforma. Tú decides el precio por día
                y qué días prestarla. Nosotros nos encargamos de verificar a los conductores y transferirte tus pagos.
              </p>

              <div className="owner-perks">
                <div className="perk">
                  <span className="perk-icon">🛡️</span>
                  <div>
                    <h4>Conductores verificados</h4>
                    <p>Revisamos antecedentes, cédula y licencia de cada cliente.</p>
                  </div>
                </div>

                <div className="perk">
                  <span className="perk-icon">💳</span>
                  <div>
                    <h4>Pagos seguros a tu cuenta</h4>
                    <p>Recibe tus ganancias directamente en Bancolombia, Nequi o Daviplata.</p>
                  </div>
                </div>

                <div className="perk">
                  <span className="perk-icon">⏱️</span>
                  <div>
                    <h4>Control total de calendario</h4>
                    <p>Bloquea fechas cuando tú quieras usar tu propia moto.</p>
                  </div>
                </div>
              </div>

              <Link to="/register" className="btn-owner-cta">
                Publicar mi moto gratis
              </Link>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="how-it-works">
          <h2>Alquilar en MotoRent es así de fácil</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Elige tu moto</h4>
              <p>Explora nuestro catálogo, filtra por cilindraje o precio y elige la que más te guste.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h4>Valida tu perfil</h4>
              <p>Sube tu documento y licencia de conducción en minutos desde tu celular o PC.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h4>Recoge y rueda</h4>
              <p>Firma el acta digital, recibe la moto con tanque listo y disfruta del camino.</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>MOTO</span>RENT
            </div>
            <p className="footer-text">
              La plataforma líder de alquiler y renting de motocicletas en Colombia.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Para Clientes</h4>
            <Link to="/motos">Catálogo de motos</Link>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Crear cuenta</Link>
          </div>

          <div className="footer-links-group">
            <h4>Para Propietarios</h4>
            <a href="#propietarios">Poner moto en renta</a>
            <Link to="/register">Registrarme como Dueño</Link>
            <a href="#como-funciona">Comisiones y pagos</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MotoRent Colombia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;