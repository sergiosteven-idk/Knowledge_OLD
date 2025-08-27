import { Link } from "react-router-dom";
import "../assets/CSS/styles.css";
import "../assets/CSS/login_styles.css";
import logo from "../assets/IMG/logo.png";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-left">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo"/>
                </div>

                {/* Links */}
                <Link to="/" className="nav-item inicio">INICIO</Link>
                <Link to="/discapacidad" className="nav-item discapacidad">DISCAPACIDAD</Link>
                <Link to="/informacion" className="nav-item informacion">INFORMACIÓN</Link>
                <Link to="/contacto" className="nav-item contacto">CONTACTO</Link>
            </div>

            {/* Buscador */}
            <div className="nav-center">
                <div className="search-container">
                    <input type="text" className="search-box" placeholder="BUSCAR" />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            {/* Botones */}
            <div className="nav-right">
                <Link to="/login" className="user-btn">Iniciar Sesión</Link>
                <Link to="/signup" className="register-btn">Registrarse</Link>
            </div>
        </nav>
    );
}
