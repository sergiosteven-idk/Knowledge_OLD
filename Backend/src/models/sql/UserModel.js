

// Backend/src/models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    usuario: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    contrasena: { type: String, required: true },
  },
  { timestamps: true }
);

// Encriptar antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("contrasena")) return next();
  this.contrasena = await bcrypt.hash(this.contrasena, 10);
  next();
});

// Método para validar contraseñas
userSchema.methods.compararContrasena = async function (password) {
  return await bcrypt.compare(password, this.contrasena);
};

const User = mongoose.model("User", userSchema);

export default User;

// models/sql/UserModel.js
import { mysqlConnection } from "../../../bds/mysql.js";

export const createUser = async (user) => {
  const [result] = await mysqlConnection.execute(
    "INSERT INTO Miembro (nombre, apellido, correo, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)",
    [user.nombre, user.apellido, user.correo, user.contrasena, user.tipo_usuario]
  );
  return result.insertId;
};

export const findUserByEmail = async (correo) => {
  const [rows] = await mysqlConnection.execute(
    "SELECT * FROM Miembro WHERE correo = ?",
    [correo]
  );
  return rows[0];
};