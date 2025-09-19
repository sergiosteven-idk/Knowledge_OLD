import React from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/userNavbar.jsx";
import A11yBar from "../../components/A11yBar";
import Footer from "../../components/Footer.jsx";

// src/pages/UserHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import A11yBar from "../../components/A11yBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = localStorage.getItem("usuario");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  // === Datos simulados ===
  const archivos = [
    { id: 1, nombre: "Curso de Programación Accesible", tipo: "visual" },
    { id: 2, nombre: "Podcast de Inclusión Educativa", tipo: "auditiva" },
    { id: 3, nombre: "Guía de Alfabetización Digital", tipo: "cognitiva" },
    { id: 4, nombre: "Video con Lengua de Señas", tipo: "auditiva" },
    { id: 5, nombre: "Manual en Braille Digital", tipo: "visual" },
  ];

  const misCursos = [
    { id: 101, titulo: "Introducción a la Accesibilidad Web (PDF)", progreso: 70 },
    { id: 102, titulo: "Podcast: Educación Inclusiva Hoy", progreso: 45 },
    { id: 103, titulo: "Audiolibro: Historias de Superación", progreso: 90 },
  ];

  // === Filtros ===
  const [filtros, setFiltros] = useState({
    visual: false,
    auditiva: false,
    cognitiva: false,
  });

  const toggleFiltro = (tipo) => {
    setFiltros((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  const archivosFiltrados = archivos.filter((a) => {
    const activos = Object.keys(filtros).filter((f) => filtros[f]);
    if (activos.length === 0) return true;
    return activos.includes(a.tipo);
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(135deg, #10b981, #6b21a8)",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
      }}
    >
      {/* Contenedor principal */}
      <div
        style={{
          background: "#ffffff",
          color: "#1e293b",
          borderRadius: "20px",
          padding: "2rem",
          maxWidth: "1000px",
          width: "100%",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.6s ease-in-out",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "0.5rem",
            color: "#6b21a8",
            textAlign: "center",
          }}
        >
          Bienvenido 👋
        </h1>
        {usuario && (
          <p style={{ fontSize: "1.1rem", marginBottom: "2rem", textAlign: "center" }}>
            Usuario: <strong>{usuario}</strong>
          </p>
        )}

        {/* === Sección Mis Cursos === */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "#10b981" }}>📚 Mis Cursos</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {misCursos.map((curso) => (
              <div
                key={curso.id}
                style={{
                  background: "#f9f9f9",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem", color: "#1e293b" }}>{curso.titulo}</h3>
                <div
                  style={{
                    height: "12px",
                    borderRadius: "6px",
                    background: "#e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${curso.progreso}%`,
                      height: "100%",
                      background: curso.progreso < 50 ? "#facc15" : curso.progreso < 80 ? "#10b981" : "#6b21a8",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#475569" }}>
                  Progreso: <strong>{curso.progreso}%</strong>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* === Sección Archivos con Filtros === */}
        <section>
          <h2 style={{ marginBottom: "1rem", color: "#10b981" }}>📂 Recursos Disponibles</h2>
          {/* Filtros */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <label>
              <input type="checkbox" checked={filtros.visual} onChange={() => toggleFiltro("visual")} /> Visual
            </label>
            <label>
              <input type="checkbox" checked={filtros.auditiva} onChange={() => toggleFiltro("auditiva")} /> Auditiva
            </label>
            <label>
              <input type="checkbox" checked={filtros.cognitiva} onChange={() => toggleFiltro("cognitiva")} /> Cognitiva
            </label>
          </div>

          {/* Grilla */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {archivosFiltrados.map((archivo) => (
              <div
                key={archivo.id}
                style={{
                  background: "#f9f9f9",
                  border: `2px solid ${
                    archivo.tipo === "visual"
                      ? "#10b981"
                      : archivo.tipo === "auditiva"
                      ? "#6b21a8"
                      : "#6366f1"
                  }`,
                  borderRadius: "12px",
                  padding: "1rem",
                  textAlign: "left",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem", color: "#1e293b" }}>{archivo.nombre}</h3>
                <p style={{ fontSize: "0.9rem", color: "#475569" }}>
                  Tipo: <strong style={{ textTransform: "capitalize" }}>{archivo.tipo}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Botón logout */}
        <button
          onClick={logout}
          style={{
            marginTop: "2rem",
            padding: "12px 24px",
            borderRadius: "10px",
            background: "#ef4444",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#b91c1c")}
          onMouseLeave={(e) => (e.target.style.background = "#ef4444")}
        >
          🚪 Cerrar sesión
        </button>
      </div>

      {/* Barra de accesibilidad */}
      <A11yBar />
    </div>
  );
}