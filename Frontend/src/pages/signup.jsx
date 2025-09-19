import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/CSS/signup_styles.css";
import { registerUser, authStorage } from "../services/authService"; // Importación única
import A11yBar from "../components/A11yBar";

export default function Signup() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [aceptaTyC, setAceptaTyC] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({
    usuario: "",
    email: "",
    contrasena: "",
    tyc: "",
    general: "",
  });

  const navigate = useNavigate();

  // ✅ Validaciones mejoradas
  const validar = () => {
    const nuevosErrores = {
      usuario: "",
      email: "",
      contrasena: "",
      tyc: "",
      general: "",
    };

    let esValido = true;

    // Validar usuario
    if (!usuario.trim()) {
      nuevosErrores.usuario = "El usuario es obligatorio";
      esValido = false;
    } else if (!/^[a-zA-Z0-9._-]{3,50}$/.test(usuario)) {
      nuevosErrores.usuario = "Usuario 3-50 caracteres (letras, números, . _ -)";
      esValido = false;
    }

    // Validar email
    if (!email.trim()) {
      nuevosErrores.email = "El correo es obligatorio";
      esValido = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      nuevosErrores.email = "Correo electrónico inválido";
      esValido = false;
    }

    // Validar contraseña
    if (!contrasena) {
      nuevosErrores.contrasena = "La contraseña es obligatoria";
      esValido = false;
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = "Mínimo 6 caracteres";
      esValido = false;
    } else if (!/[a-zA-Z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      nuevosErrores.contrasena = "Debe contener letras y números";
      esValido = false;
    }

    // Validar términos y condiciones
    if (!aceptaTyC) {
      nuevosErrores.tyc = "Debes aceptar los Términos y Condiciones";
      esValido = false;
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  // ✅ Manejo de envío del formulario (versión corregida)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validar()) return;
    
    setCargando(true);
    setErrores(prev => ({ ...prev, general: "" }));
    
    try {
      const data = await registerUser({ usuario, email, contrasena });
      
      // Guardar en localStorage usando authStorage
      authStorage.set(data.token, data.user);
      
      setMensaje("✅ Registro exitoso, redirigiendo...");
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => navigate("/dashboard"), 1500);
      
    } catch (err) {
      setErrores(prev => ({
        ...prev,
        general: err.message || "Error en el registro. Intenta nuevamente."
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

            {/* Términos y Condiciones */}
            <div className="form-group checkbox-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="aceptar-tyc"
                  checked={aceptaTyC}
                  onChange={(e) => setAceptaTyC(e.target.checked)}
                  aria-invalid={!!errores.tyc}
                  aria-describedby="tyc-error"
                />
                <label htmlFor="aceptar-tyc" className="checkbox-label">
                  Acepto los{" "}
                  <Link to="/tyc" className="login-link" target="_blank">
                    Términos y Condiciones
                  </Link>
                </label>
              </div>
              <span id="tyc-error" className="error-message">
                {errores.tyc}
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