import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/sql/UserModel.js";

// Registro
export const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, tipo_usuario } = req.body;

    // Validar campos
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar duplicado
    const existingUser = await findUserByEmail(correo);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Crear usuario
    const newUserId = await createUser({ nombre, apellido, correo, contrasena, tipo_usuario });

    res.status(201).json({ message: "Usuario creado con éxito", userId: newUserId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const user = await findUserByEmail(correo);
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo, rol: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
};
