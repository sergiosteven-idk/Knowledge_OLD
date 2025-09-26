// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "CAMBIA-ESTO";

// Verificar token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const role = String(decoded.role ?? decoded.rol ?? "").toLowerCase();
    req.user = { ...decoded, role, is_admin: decoded.is_admin ?? role === "admin" };
    next();
  } catch {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

// Sólo admins
export const verifyAdmin = (req, res, next) => {
  const role = String(req.user?.role ?? req.user?.rol ?? "").toLowerCase();
  if (role !== "admin" && !req.user?.is_admin) {
    return res.status(403).json({ message: "Acceso denegado, solo admins" });
  }
  next();
};
