import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/CSS/signup_styles.css";
import logoImg from "../assets/IMG/logo.png";
import { loginUser } from "../services/authService";
import A11yBar from "../components/A11yBar";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({
    email: "",
    contrasena: "",
    general: "",
  });

  // ✅ Validación básica antes de enviar
  const validar = () => {
    let ok = true;
    const next = { email: "", contrasena: "", general: "" };

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      next.email = "El correo no tiene un formato válido";
      ok = false;
    }
    if (
      contrasena.length < 6 ||
      !/[a-zA-Z]/.test(contrasena) ||
      !/[0-9]/.test(contrasena)
    ) {
      next.contrasena = "Debe tener al menos 6 caracteres, con letras y números";
      ok = false;
    }

    setErrores(next);
    return ok;
  };

  // ✅ Enviar al backend
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setCargando(true);
    setErrores({ email: "", contrasena: "", general: "" });

    try {
      // 👇 importante: tu backend espera "email" y "contrasena"
      const data = await loginUser({ email, contrasena });

      if (data.token) {
        // Guardar en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", data.user?.usuario || "");
        localStorage.setItem("email", data.user?.email || email);

        // Redirigir a la zona privada
        navigate("/dashboard");
      } else {
        setErrores((prev) => ({
          ...prev,
          general: data.message || "Credenciales incorrectas",
        }));
      }
    } catch (err) {
      setErrores((prev) => ({
        ...prev,
        general: err.message || "No se pudo conectar al servidor",
      }));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <A11yBar />

      <div className="signup-container">
        <div className="signup-card">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-container">
              <img src={logoImg} alt="Logo Knowledge" className="logo" />
            </div>
          </div>

          <h2>Iniciar sesión</h2>

          <form
            className="signup-form"
            onSubmit={onSubmit}
            noValidate
            aria-label="Formulario de inicio de sesión"
          >
            {/* Mensaje de error general */}
            {errores.general && (
              <div
                className="general-error"
                role="alert"
                aria-live="assertive"
              >
                {errores.general}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                autoComplete="email"
                maxLength={50}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!errores.email}
                aria-describedby="email-error"
              />
              <span id="email-error" className="error-message">
                {errores.email}
              </span>
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">
                Contraseña
              </label>
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
                  required
                  aria-invalid={!!errores.contrasena}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setVerPass((v) => !v)}
                  aria-label={verPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {verPass ? "🙈" : "👁️"}
                </button>
              </div>
              <span id="password-error" className="error-message">
                {errores.contrasena}
              </span>
            </div>

            {/* Link a registro */}
            <div className="login-section">
              <Link to="/signup" className="login-link">
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={cargando}
              aria-busy={cargando}
            >
              {cargando ? "Validando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
