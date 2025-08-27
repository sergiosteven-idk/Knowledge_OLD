// src/pages/login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/CSS/signup_styles.css"; // Usa el mismo CSS
import logoImg from "../assets/IMG/logo.png";

export default function Login() {
  const navigate = useNavigate();

  // estados
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({ usuario: "", contrasena: "", general: "" });

  // validaciones rápidas
  const validar = () => {
    let ok = true;
    const next = { usuario: "", contrasena: "", general: "" };

    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(usuario)) {
      next.usuario = "Usuario 3-50 caracteres (letras, números, . _ -)";
      ok = false;
    }
    if (contrasena.length < 6 || !/[a-zA-Z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      next.contrasena = "Mínimo 6 caracteres con letras y números";
      ok = false;
    }

    setErrores(next);
    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setCargando(true);
    setErrores(prev => ({ ...prev, general: "" }));

    // Simulación de login (luego lo conectamos al backend)
    setTimeout(() => {
      setCargando(false);
      if ((usuario === "admin" && contrasena === "123456") || (usuario === "test" && contrasena === "test123")) {
        navigate("/"); // redirige al home
      } else {
        setErrores(prev => ({ ...prev, general: "Usuario o contraseña incorrectos" }));
      }
    }, 1200);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-container">
            {logoImg ? (
              <img src={logoImg} alt="Knowledge Logo" className="logo" id="logo" />
            ) : (
              <div className="logo-placeholder" id="logo-placeholder">
                <div className="logo-circle">
                  <span className="logo-text">Knowledge</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Encabezado */}
        <h2>iniciar sesión</h2>

        {/* Formulario */}
        <form className="signup-form" id="loginForm" onSubmit={onSubmit} noValidate>
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
            <label htmlFor="usuario" className="form-label">usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="form-input"
              autoComplete="username"
              maxLength={50}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <span className="error-message">{errores.usuario}</span>
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="contrasena" className="form-label">contraseña</label>
            <div className="password-container">
              <input
                type={verPass ? "text" : "password"}
                id="contrasena"
                name="contrasena"
                className="form-input"
                autoComplete="current-password"
                minLength={6}
                maxLength={100}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setVerPass((v) => !v)}
                aria-label="Mostrar/Ocultar contraseña"
              >
                {verPass ? "🙈" : "👁️"}
              </button>
            </div>
            <span className="error-message">{errores.contrasena}</span>
          </div>

          {/* Enlace a registro */}
          <div className="login-section">
            <Link to="/signup" className="login-link">
              ¿no tienes cuenta? regístrate
            </Link>
          </div>

          {/* Botón */}
          <button type="submit" className="signup-btn" disabled={cargando}>
            {cargando ? "Validando..." : "iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
