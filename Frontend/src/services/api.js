    // Frontend/src/services/api.js
    const API_URL = "http://localhost:5000/api"; // apunta al backend

    export async function register(usuario, email, contrasena) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, email, contrasena }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error en el registro");
    }
    return res.json();
    }

    export async function login(email, contrasena) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error en el login");
    }
    return res.json();
    }
