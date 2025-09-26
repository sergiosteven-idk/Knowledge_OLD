// Backend/src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/sql/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "CAMBIA-ESTO";

// Registro
export const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, email, contrasena, password, tipo_usuario } = req.body;

    const userEmail = correo || email;
    const userPassword = contrasena || password;

    if (!nombre || !apellido || !userEmail || !userPassword) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await findUserByEmail(userEmail);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const newUserId = await createUser({
      nombre,
      apellido,
      correo: userEmail,
      contrasena: userPassword,
      tipo_usuario,
    });

    res.status(201).json({ message: "Usuario creado con éxito", userId: newUserId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { correo, email, contrasena, password } = req.body;

    const userEmail = correo || email;
    const userPassword = contrasena || password;

    if (!userEmail || !userPassword) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    const user = await findUserByEmail(userEmail);
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(userPassword, user.contrasena);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const role = (user.tipo_usuario || "").toLowerCase() === "admin" || user.is_admin ? "admin" : "user";

    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo, role, is_admin: role === "admin", rol: role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const shapedUser = {
      id_usuario: user.id_usuario,
      correo: user.correo,
      tipo_usuario: role === "admin" ? "admin" : (user.tipo_usuario || "estudiante"),
      tipo_admin: user.tipo_admin || null
    };

    res.json({ message: "Login exitoso", token, user: shapedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
};
