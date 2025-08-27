import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Servidor funcionando");
});

// Probar conexión a MySQL
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() as now");
    res.json({ success: true, time: rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${process.env.PORT}`);
});
