const express = require("express");
const router = express.Router();
const { obtenerPerfil } = require("../controllers/userController");

router.get("/perfil/:userId", obtenerPerfil);

module.exports = router;
