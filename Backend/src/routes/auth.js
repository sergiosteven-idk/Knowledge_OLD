// Backend/src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/mongo/userModel.js"; // Mongo
import { createUser, findUserByEmail } from "../models/sql/UserModel.js"; // SQL

const router = express.Router();

// ✅ Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { usuario, email, contrasena } = req.body;

    // 1️⃣ Validaciones básicas
    if (!usuario || usuario.length < 3) {
      return res.status(400).json({ message: "El nombre de usuario es muy corto" });
    }
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "Correo inválido" });
    }
    if (!contrasena || contrasena.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // 2️⃣ Comprobar si ya existe en SQL
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 3️⃣ Encriptar contraseña
    const hashedPass = await bcrypt.hash(contrasena, 10);

    // 4️⃣ Guardar en SQL
    const userId = await createUser({
      nombre: usuario,
      apellido: "",
      correo: email,
      contrasena: hashedPass,
      tipo_usuario: "user",
    });

    // 5️⃣ Guardar en Mongo (opcional)
    const mongoUser = new User({ usuario, email, contrasena: hashedPass });
    await mongoUser.save();

    // 6️⃣ Generar token
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Usuario creado con éxito",
      token,
      user: { usuario, email },
    });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar en SQL
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar contraseña
    const valido = await bcrypt.compare(contrasena, user.contrasena);
    if (!valido) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Token
    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: { usuario: user.nombre, email: user.correo },
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
