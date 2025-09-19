// Backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

// Conexiones a BD
import connectMongo from "../bds/mongodb.js";
import { mysqlConnection } from "../bds/mysql.js";

// Rutas
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import userRoutes from "./routes/users.js";
// import blogRoutes from "./routes/blog.routes.js";
// import feedbackRoutes from "./routes/feedback.routes.js";

dotenv.config();

const app = express();

// 🔒 Seguridad + CORS
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",   // frontend con Vite
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 📦 Middlewares
app.use(express.json());

// 🌐 Conexión a MongoDB
connectMongo();

// 🗄️ Conexión a MySQ
