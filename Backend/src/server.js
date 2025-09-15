// Backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";              // 👈 agregado
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ habilitar CORS antes de las rutas
app.use(cors({
  origin: "http://localhost:5173",   // URL de tu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Conectar DB
connectDB();

// Rutas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
