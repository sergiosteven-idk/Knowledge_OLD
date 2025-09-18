// Backend/src/models/mongo/userModel.js
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

// 🔐 Encriptar antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("contrasena")) return next();
  this.contrasena = await bcrypt.hash(this.contrasena, 10);
  next();
});

// 🔑 Método para comparar contraseñas
userSchema.methods.compararContrasena = async function (password) {
  return await bcrypt.compare(password, this.contrasena);
};

const User = mongoose.model("User", userSchema);

export default User;
