// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

function getRoleFromTokenOrUser() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  let role = "";
  let isAdmin = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = String(payload.role ?? payload.rol ?? "").toLowerCase();
      isAdmin = Boolean(payload.is_admin ?? role === "admin");
    } catch {}
  }

  // Respaldo: tu objeto user en localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole = String(user?.tipo_usuario || "").toLowerCase();

  if (!role && userRole) {
    role = userRole;
    isAdmin = role === "admin";
  }

  return { role, isAdmin, hasAuth: Boolean(token || user) };
}

export default function PrivateRoute({ children, role }) {
  const { role: current, isAdmin, hasAuth } = getRoleFromTokenOrUser();

  if (!hasAuth) return <Navigate to="/login" replace />;

  // Si la ruta es de admin y no es admin
  if (role === "admin" && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si la ruta es de usuario y es admin
  if (role === "user" && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
