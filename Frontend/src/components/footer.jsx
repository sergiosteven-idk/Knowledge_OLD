import "../assets/CSS/styles.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Logo + nombre */}
        <div className="footer-left">
          <h2 className="footer-logo">MiProyecto</h2>
          <p>Construyendo un mundo más inclusivo 🌍</p>
        </div>

        {/* Enlaces rápidos */}
        <div className="footer-links">
          <a href="/">Inicio</a>
          <a href="/discapacidad">Discapacidad</a>
          <a href="/informacion">Información</a>
          <a href="/contacto">Contacto</a>
        </div>

        {/* Redes sociales */}
        <div className="footer-socials">
          <a href="#" target="_blank" rel="noreferrer">👍 Facebook</a>
          <a href="#" target="_blank" rel="noreferrer">🐦 Twitter</a>
          <a href="#" target="_blank" rel="noreferrer">📸 Instagram</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MiProyecto | Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
