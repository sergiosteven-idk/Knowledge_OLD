// Backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import connectMongo from "../bds/mongodb.js";        // si lo estás usando
import pool from "./db.js";                           // ← usa el MISMO pool que usan los modelos

// Rutas
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

// 🔒 seguridad + CORS
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 📦 middlewares
app.use(express.json());

// 🌐 Conexión Mongo (si aplica)
connectMongo().catch(err => console.error("❌ Error Mongo:", err));

// 🗄️ Probar conexión MySQL usando el mismo pool de src/db.js
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conectado a MySQL");
    conn.release();
  } catch (err) {
    console.error("❌ Error MySQL:", err);
  }
})();

// 📌 Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 🛠 Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🚀 Servidor
const PORT = process.env.PORT || 3306;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:3306`)
);
