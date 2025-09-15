// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = localStorage.getItem("usuario");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bienvenido 🚀</h1>
      {usuario && <p>Usuario: {usuario}</p>}

      <button 
        onClick={logout} 
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          background: "#ef4444",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
