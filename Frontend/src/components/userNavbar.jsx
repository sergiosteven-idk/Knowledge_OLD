// src/components/UserNavbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UserNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="user-navbar"
      aria-label="Navegación de usuario"
      style={{
        background: "#10b981", // verde accesibilidad
        padding: "0.8rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Logo / título */}
      <div style={{ fontWeight: "bold", color: "#fff", fontSize: "1.2rem" }}>
        Knowledge
      </div>

      {/* Botón menú responsive */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Abrir menú"
        style={{
          display: "none",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
        className="menu-toggle"
      >
        ☰
      </button>

      {/* Links */}
      <ul
        className={`nav-links ${open ? "open" : ""}`}
        style={{
          listStyle: "none",
          display: "flex",
          gap: "1.2rem",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link to="/cursos" className="nav-link">
            Cursos
          </Link>
        </li>
        <li>
          <Link to="/mis-cursos" className="nav-link">
            Mis Cursos
          </Link>
        </li>
        <li>
          <Link to="/perfil" className="nav-link">
            Perfil
          </Link>
        </li>
      </ul>
    </nav>
  );
}
