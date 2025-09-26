import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/CSS/signup_styles.css";
import logoImg from "../assets/IMG/logo.png";
import { loginUser } from "../services/authService";
import A11yBar from "../components/A11yBar";

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({
    correo: "",
    contrasena: "",
    general: "",
  });

  // ✅ Validación
  const validar = () => {
    let ok = true;
    const next = { correo: "", contrasena: "", general: "" };

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      next.correo = "El correo no tiene un formato válido";
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
    setErrores({ correo: "", contrasena: "", general: "" });

    try {
      const data = await loginUser({ correo, contrasena });

      if (data.token && data.user) {
        // Guardar en localStorage toda la info útil
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // incluye tipo_usuario
        localStorage.setItem("correo", data.user.correo);

        // Redirigir según token (robusto) o user como respaldo
        let role = "";
        let isAdmin = false;
        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          role = String(payload.role ?? payload.rol ?? "").toLowerCase();
          isAdmin = Boolean(payload.is_admin ?? role === "admin");
        } catch {}

        if (isAdmin || role === "admin" || data.user.tipo_usuario === "admin") {
          navigate("/admin/dashboard"); // 👈 cambio: ir directo al dashboard
        } else {
          navigate("/dashboard");
        }
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
            {errores.general && (
              <div className="general-error" role="alert" aria-live="assertive">
                {errores.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="form-input"
                autoComplete="email"
                maxLength={50}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                aria-invalid={!!errores.correo}
                aria-describedby="correo-error"
              />
              <span id="correo-error" className="error-message">
                {errores.correo}
              </span>
            </div>

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
