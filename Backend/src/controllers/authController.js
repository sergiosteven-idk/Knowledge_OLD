import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Registro
export async function register(req, res) {
  try {
    const { usuario, email, contrasena } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const nuevoUsuario = new User({ usuario, email, contrasena });
    await nuevoUsuario.save();

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: nuevoUsuario._id,
        usuario: nuevoUsuario.usuario,
        email: nuevoUsuario.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, contrasena } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const valido = await usuario.compararContrasena(contrasena);
    if (!valido) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: usuario._id,
        usuario: usuario.usuario,
        email: usuario.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}
