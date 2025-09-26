import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/CSS/signup_styles.css";
import { registerUser } from "../services/authService";
import A11yBar from "../components/A11yBar";

export default function Signup() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    general: "",
  });

  const navigate = useNavigate();

  // ✅ Validaciones
  const validar = () => {
    let ok = true;
    const next = { nombre: "", apellido: "", correo: "", contrasena: "", general: "" };

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(nombre)) {
      next.nombre = "Nombre entre 2 y 50 caracteres (solo letras)";
      ok = false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(apellido)) {
      next.apellido = "Apellido entre 2 y 50 caracteres (solo letras)";
      ok = false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      next.correo = "Correo inválido";
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
      const data = await registerUser({ nombre, apellido, correo, contrasena });

      if (data.token) {
        // Guardar sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("nombre", data.user?.nombre || nombre);
        localStorage.setItem("apellido", data.user?.apellido || apellido);
        localStorage.setItem("correo", data.user?.correo || correo);
        // Compatibilidad si otras vistas aún leen "email"
        localStorage.setItem("email", data.user?.correo || correo);

        setMensaje("✅ Registro exitoso, redirigiendo...");
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

            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                id="nombre"
                className="form-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                aria-invalid={!!errores.nombre}
                aria-describedby="nombre-error"
              />
              <span id="nombre-error" className="error-message">{errores.nombre}</span>
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                id="apellido"
                className="form-input"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                aria-invalid={!!errores.apellido}
                aria-describedby="apellido-error"
              />
              <span id="apellido-error" className="error-message">{errores.apellido}</span>
            </div>

            {/* Correo */}
            <div className="form-group">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input
                type="email"
                id="correo"
                className="form-input"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                aria-invalid={!!errores.correo}
                aria-describedby="correo-error"
              />
              <span id="correo-error" className="error-message">{errores.correo}</span>
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
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
              <span id="password-error" className="error-message">{errores.contrasena}</span>
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
