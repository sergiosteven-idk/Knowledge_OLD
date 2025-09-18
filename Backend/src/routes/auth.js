import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/mongo/userModel.js"; // Mongo
import { createUser, findUserByEmail } from "../models/sql/UserModel.js"; // SQL


const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { usuario, email, contrasena } = req.body;

    // 1️⃣ Verificar si ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 2️⃣ Encriptar
    const hashedPass = await bcrypt.hash(contrasena, 10);

    // 3️⃣ Guardar en SQL
    const userId = await createUser({
      nombre: usuario,     // o ajusta según tu tabla
      apellido: "",
      correo: email,
      contrasena: hashedPass,
      tipo_usuario: "user",
    });

    // 4️⃣ También guardar en Mongo (opcional si quieres redundancia)
    const mongoUser = new User({ usuario, email, contrasena });
    await mongoUser.save();

    // 5️⃣ Token
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "Usuario creado", token, user: { usuario, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // 1️⃣ Buscar usuario
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 2️⃣ Validar contraseña
    const valido = await bcrypt.compare(contrasena, user.contrasena);
    if (!valido) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 3️⃣ Generar token
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login exitoso", token, user: { usuario: user.nombre, email: user.correo } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
