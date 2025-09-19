
// 🔧 Función para definir la URL base dinámicamente según el entorno
const getAPIBase = () => {
  if (import.meta.env.MODE === "production") {
    return import.meta.env.VITE_API_URL || "/api"; // usa variable en .env.production
  }
  return "/api"; // En desarrollo usa proxy de Vite
};

const API_BASE = getAPIBase();
const API_URL = `${API_BASE}/auth`;

// 📝 Helper para llamadas API con manejo de errores
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include", // incluye cookies
      ...options,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Error ${res.status}: ${res.statusText}`);
    }

    return data;
  } catch (err) {
    console.error(`Error en fetchAPI(${endpoint}):`, err);
    if (err.name === "TypeError") {
      throw new Error("⚠️ No se pudo conectar al servidor.");
    }
    throw err;
  }
};

// ✅ Registro
export const registerUser = async (userData) =>
  fetchAPI("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

// ✅ Login
export const loginUser = async (credentials) =>
  fetchAPI("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

// ✅ Verificar sesión activa
export const verifyAuth = async () => fetchAPI("/verify");

// ✅ Logout
export const logoutUser = async () => {
  try {
    await fetchAPI("/logout", { method: "POST" });
  } finally {
    authStorage.clear();
  }
};

// ✅ Gestión de almacenamiento local
export const authStorage = {
  set: (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
  },
  getToken: () => localStorage.getItem("authToken"),
  getUser: () => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  },
  clear: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  },
  isValid: () => !!localStorage.getItem("authToken"),
};
