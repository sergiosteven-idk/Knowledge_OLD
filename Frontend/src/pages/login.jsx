import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/CSS/signup_styles.css"; 
import logoImg from "../assets/IMG/logo.png";
import { login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({ email: "", contrasena: "", general: "" });

  // validación rápida
  const validar = () => {
    let ok = true;
    const next = { email: "", contrasena: "", general: "" };

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setCargando(true);
    setErrores(prev => ({ ...prev, general: "" }));

    try {
      const data = await login(email, contrasena);

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", data.user.usuario);
      localStorage.setItem("email", data.user.email);

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (err) {
      setErrores(prev => ({ ...prev, general: err.message }));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
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

        <h2>Iniciar sesión</h2>

        <form className="signup-form" id="loginForm" onSubmit={onSubmit} noValidate>
          {errores.general && (
            <div className="general-error" style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              padding: "10px 15px",
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 14,
              textAlign: "center",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}>
              {errores.general}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              autoComplete="email"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="error-message">{errores.email}</span>
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
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

          <div className="login-section">
            <Link to="/signup" className="login-link">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>

          <button type="submit" className="signup-btn" disabled={cargando}>
            {cargando ? "Validando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
