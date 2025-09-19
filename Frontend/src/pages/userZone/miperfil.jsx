// src/pages/MiPerfil.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import A11yBar from "../../components/A11yBar";
import "../../assets/CSS/userNavbar";
import "../../assets/CSS/Footer";

export default function MiPerfil() {
  const navigate = useNavigate();

  // Estado para el usuario
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
  });

  const [editando, setEditando] = useState(false);

  useEffect(() => {
    // Simulación: obtener datos del usuario logueado desde localStorage
    const nombre = localStorage.getItem("usuario") || "UsuarioDemo";
    const correo = localStorage.getItem("correo") || "correo@demo.com";
    const contrasena = localStorage.getItem("contrasena") || "123456";

    setUsuario({ nombre, correo, contrasena });
  }, []);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    localStorage.setItem("usuario", usuario.nombre);
    localStorage.setItem("correo", usuario.correo);
    localStorage.setItem("contrasena", usuario.contrasena);
    setEditando(false);
    alert("✅ Datos actualizados correctamente.");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("correo");
    localStorage.removeItem("contrasena");
    navigate("/login");
  };

  const eliminarCuenta = () => {
    if (window.confirm("⚠️ ¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      localStorage.clear();
      navigate("/signup");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #10b981, #6b21a8)",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          color: "#1e293b",
          borderRadius: "20px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ color: "#6b21a8", marginBottom: "1rem" }}>👤 Mi Perfil</h1>

        {!editando ? (
          <>
            <p>
              <strong>Usuario:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {usuario.correo}
            </p>
            <p>
              <strong>Contraseña:</strong> {"*".repeat(usuario.contrasena.length)}
            </p>

            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <button
                onClick={() => setEditando(true)}
                style={btnStyle("#10b981")}
              >
                ✏️ Editar datos
              </button>
              <button onClick={logout} style={btnStyle("#f59e0b")}>
                🚪 Cerrar sesión
              </button>
              <button onClick={eliminarCuenta} style={btnStyle("#ef4444")}>
                🗑️ Eliminar cuenta
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                style={inputStyle}
              />
              <input
                type="email"
                name="correo"
                value={usuario.correo}
                onChange={handleChange}
                placeholder="Correo electrónico"
                style={inputStyle}
              />
              <input
                type="password"
                name="contrasena"
                value={usuario.contrasena}
                onChange={handleChange}
                placeholder="Contraseña"
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={guardarCambios} style={btnStyle("#10b981")}>
                💾 Guardar
              </button>
              <button onClick={() => setEditando(false)} style={btnStyle("#ef4444")}>
                ❌ Cancelar
              </button>
            </div>
          </>
        )}
      </div>

      {/* Barra de accesibilidad flotante */}
      <A11yBar />
    </div>
  );
}

// === Estilos reutilizables ===
const btnStyle = (bg) => ({
  padding: "12px 24px",
  borderRadius: "10px",
  background: bg,
  color: "white",
  fontSize: "1rem",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
});

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "1rem",
};
