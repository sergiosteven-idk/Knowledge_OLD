import { useState } from "react";
import "../assets/CSS/signup_styles.css";
import { register } from "../services/api"; // ⬅️ usamos el servicio real
import { useNavigate } from "react-router-dom";
import "../components/A11yBar";

export default function Signup() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({ usuario: "", email: "", contrasena: "", general: "" });

  const navigate = useNavigate();

  // validaciones rápidas
  const validar = () => {
    let ok = true;
    const next = { usuario: "", email: "", contrasena: "", general: "" };

    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(usuario)) {
      next.usuario = "Usuario 3-50 caracteres (letras, números, . _ -)";
      ok = false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      next.email = "Correo inválido";
      ok = false;
    }
    if (contrasena.length < 6 || !/[a-zA-Z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      next.contrasena = "Mínimo 6 caracteres con letras y números";
      ok = false;
    }

    setErrores(next);
    return ok;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setCargando(true);
    setErrores(prev => ({ ...prev, general: "" }));

    try {
      const data = await register(usuario, email, contrasena);
      setMensaje(data.message);

      // Redirigir al login después de 1.5s
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrores(prev => ({ ...prev, general: err.message }));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div class=".auth-wrapper">
      <div className="signup-container">
        <div className="signup-card">
          <h2>Crear cuenta</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Error general */}
            {errores.general && (
              <div
                className="general-error"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  padding: "10px 15px",
                  borderRadius: 8,
                  marginBottom: 20,
                  fontSize: 14,
                  textAlign: "center",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                {errores.general}
              </div>

            )}

            {/* Usuario */}
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <input
                className="form-input"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
              <span className="error-message">{errores.usuario}</span>
            </div>

            {/* Correo */}
            <div className="form-group">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="error-message">{errores.email}</span>
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <span className="error-message">{errores.contrasena}</span>
            </div>

            {/* Botón */}
            <button className="signup-btn" type="submit" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          {mensaje && <p className="signup-message">{mensaje}</p>}

          <div className="login-section">
            <a href="/login" className="login-link">¿Ya tienes cuenta? Inicia sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
}
