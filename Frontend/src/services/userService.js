const API_URL = "http://localhost:5000/api/users";

// Obtener todos los usuarios (solo admin)
export const getUsers = async (token) => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};

// Obtener un usuario por ID
export const getUserById = async (id, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
};

// Crear un nuevo usuario
export const createUser = async (user, token) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
};

// Actualizar usuario
export const updateUser = async (id, user, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return res.json();
};

// Eliminar usuario
export const deleteUser = async (id, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  return res.json();
};
