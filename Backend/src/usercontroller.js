const { getPerfil } = require("../models/userModel");

exports.obtenerPerfil = (req, res) => {
  const { userId } = req.params;
  const perfil = getPerfil(userId);
  perfil ? res.json(perfil) : res.status(404).json({ error: "Usuario no encontrado" });
};
