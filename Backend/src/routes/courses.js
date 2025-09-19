const express = require("express");
const router = express.Router();
const { obtenerCursos, obtenerMisCursos } = require("../controllers/courseController");

router.get("/", obtenerCursos);
router.get("/mis-cursos/:userId", obtenerMisCursos);

module.exports = router;
