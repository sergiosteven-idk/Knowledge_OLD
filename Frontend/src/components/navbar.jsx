import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/CSS/styles.css";
import logo from "../assets/IMG/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Menú principal">
      {/* Izquierda: Logo */}
      <div className="nav-left">
        <div className="logo-container">
          <Link to="/" aria-label="Ir a inicio">
            <img src={logo} alt="Logo Knowledge" className="logo" />
          </Link>
        </div>
      </div>

      {/* Centro: Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-item inicio" onClick={() => setMenuOpen(false)}>
          INICIO
        </Link>
        <Link
          to="/discapacidad"
          className="nav-item discapacidad"
          onClick={() => setMenuOpen(false)}
        >
          DISCAPACIDAD
        </Link>
        <Link
          to="/informacion"
          className="nav-item informacion"
          onClick={() => setMenuOpen(false)}
        >
          INFORMACIÓN
        </Link>
        <Link
          to="/contacto"
          className="nav-item contacto"
          onClick={() => setMenuOpen(false)}
        >
          CONTACTO
        </Link>

        {/* Opciones móviles */}
        <div className="nav-right mobile-only">
          <Link to="/login" className="user-btn" onClick={() => setMenuOpen(false)}>
            Iniciar Sesión
          </Link>
          <Link to="/signup" className="register-btn" onClick={() => setMenuOpen(false)}>
            Registrarse
          </Link>
        </div>
      </div>

      {/* Centro: Buscador */}
      <div className="nav-center">
        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder="Buscar..."
            aria-label="Buscar en la plataforma"
          />
          <span className="search-icon" aria-hidden="true">🔍</span>
        </div>
      </div>

      {/* Derecha: Botones (versión escritorio) */}
      <div className="nav-right desktop-only">
        <Link to="/login" className="user-btn">
          Iniciar Sesión
        </Link>
        <Link to="/signup" className="register-btn">
          Registrarse
        </Link>
      </div>

      {/* Botón Hamburguesa */}
      <button
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir o cerrar menú"
        aria-expanded={menuOpen}
      >
        ☰
      </button>
    </nav>
  );
}
