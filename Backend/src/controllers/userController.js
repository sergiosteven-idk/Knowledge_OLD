// Backend/src/controllers/userController.js
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../models/sql/UserModel.js";

export async function getUsers(req, res) {
  try {
    const rows = await getAllUsers();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
}

export async function getUser(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
}

export async function updateUser(req, res) {
  try {
    const changed = await updateUserById(req.params.id, req.body);
    if (!changed) return res.status(400).json({ message: "Nada para actualizar" });
    res.json({ message: "Usuario actualizado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
}

export async function deleteUser(req, res) {
  try {
    const deleted = await deleteUserById(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
}
