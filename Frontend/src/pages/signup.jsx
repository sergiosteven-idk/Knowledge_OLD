import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/CSS/signup_styles.css";
import { registerUser } from "../services/authService";
import A11yBar from "../components/A11yBar";

export default function Signup() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({
    usuario: "",
    email: "",
    contrasena: "",
    general: "",
  });

  const navigate = useNavigate();

  // ✅ Validaciones rápidas
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
    if (
      contrasena.length < 6 ||
      !/[a-zA-Z]/.test(contrasena) ||
      !/[0-9]/.test(contrasena)
    ) {
      next.contrasena = "Mínimo 6 caracteres con letras y números";
      ok = false;
    }

    setErrores(next);
    return ok;
  };

  // ✅ Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setCargando(true);
    setErrores((prev) => ({ ...prev, general: "" }));

    try {
      const data = await registerUser({ usuario, email, contrasena });

      if (data.token) {
        // Guardar sesión en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", data.user?.usuario || usuario);
        localStorage.setItem("email", data.user?.email || email);

        setMensaje("✅ Registro exitoso, redirigiendo...");

        // Redirigir al dashboard
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setErrores((prev) => ({
          ...prev,
          general: data.message || "Error en el registro",
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
          <h2>Crear cuenta</h2>

          <form
            className="signup-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de registro"
          >
            {/* Error general */}
            {errores.general && (
              <div className="general-error" role="alert" aria-live="assertive">
                {errores.general}
              </div>
            )}

            {/* Usuario */}
            <div className="form-group">
              <label htmlFor="usuario" className="form-label">
                Usuario
              </label>
              <input
                id="usuario"
                className="form-input"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                aria-invalid={!!errores.usuario}
                aria-describedby="usuario-error"
              />
              <span id="usuario-error" className="error-message">
                {errores.usuario}
              </span>
            </div>

            {/* Correo */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
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
              <input
                type="password"
                id="contrasena"
                className="form-input"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                aria-invalid={!!errores.contrasena}
                aria-describedby="password-error"
              />
              <span id="password-error" className="error-message">
                {errores.contrasena}
              </span>
            </div>

            {/* Botón */}
            <button
              className="signup-btn"
              type="submit"
              disabled={cargando}
              aria-busy={cargando}
            >
              {cargando ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          {mensaje && (
            <p className="signup-message" role="status" aria-live="polite">
              {mensaje}
            </p>
          )}

          <div className="login-section">
            <Link to="/login" className="login-link">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
