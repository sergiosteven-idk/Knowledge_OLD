// src/pages/adminZone/UserCards.jsx
import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/userService";
import "../../assets/CSS/dashboard_styles.css";

export default function UserCards() {
  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers(token);
        setUsuarios(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchData();
  }, [token]);

  const eliminar = async (id_usuario) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id_usuario, token);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id_usuario));
    } catch (err) {
      alert("Error eliminando usuario");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Usuarios en Tarjetas</h1>
      <div className="stats-grid">
        {usuarios.map((u) => (
          <div key={u.id_usuario} className="stat-card">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.nombre}`}
              alt="avatar"
              style={{
                width: "80px",
                borderRadius: "50%",
                marginBottom: "1rem",
              }}
            />
            <h3>{u.nombre} {u.apellido}</h3>
            <p>{u.correo}</p>
            <p><strong>{u.tipo_usuario}</strong></p>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => eliminar(u.id_usuario)}
                style={{
                  background: "#d9534f",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                }}
              >
                ❌ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
