// Backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import connectMongo from "../bds/mongodb.js";
import { mysqlConnection } from "../bds/mysql.js";

// Rutas
import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/user.routes.js";
// import blogRoutes from "./routes/blog.routes.js";
// import feedbackRoutes from "./routes/feedback.routes.js";

dotenv.config();

const app = express();

// 🔒 seguridad + CORS
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",   // frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 📦 middlewares
app.use(express.json());

// 🌐 Conexión Mongo
connectMongo();

// 🗄️ Conexión MySQL
mysqlConnection.getConnection()
  .then(conn => {
    console.log("✅ Conectado a MySQL");
    conn.release();
  })
  .catch(err => console.error("❌ Error MySQL:", err));

// 📌 Rutas
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/blog", blogRoutes);
// app.use("/api/feedback", feedbackRoutes);

// 🛠 Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🚀 Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
