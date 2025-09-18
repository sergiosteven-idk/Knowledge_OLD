const API_URL = "http://localhost:5000/api/auth"; // backend

// Registro de usuario
export const registerUser = async ({ usuario, email, contrasena }) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, email, contrasena }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Error en el registro");
    }

    return res.json(); // { message, token, user }
  } catch (err) {
    throw new Error(err.message || "No se pudo conectar al servidor");
  }
};

// Login de usuario
export const loginUser = async ({ email, contrasena }) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Error en el login");
    }

    return res.json(); // { token, user }
  } catch (err) {
    throw new Error(err.message || "No se pudo conectar al servidor");
  }
};
