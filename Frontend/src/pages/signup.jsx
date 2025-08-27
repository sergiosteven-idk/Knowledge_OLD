import { useState } from "react";
import "../assets/CSS/signup_styles.css"; // solo el CSS que diseñaste

export default function Signup() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMensaje(`Usuario: ${usuario}, Email: ${email}, Contraseña: ${contrasena}`);
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Crear cuenta</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input className="form-input"  />
          </div>
          <div className="form-group">
            <label className="form-label">Correo</label>
            <input className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="form-input" />
          </div>
          <button className="signup-btn" type="submit">Registrarse</button>
        </form>
        {mensaje && <p className="signup-message">{mensaje}</p>}
        <div className="login-section">
          <a href="/login" className="login-link">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
