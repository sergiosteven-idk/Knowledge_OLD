// models/mongo/blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha_publicacion: { type: Date, default: Date.now },
  autor: { type: String, required: true }
});

export default mongoose.model("Blog", blogSchema);
