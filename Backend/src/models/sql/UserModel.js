// Backend/src/models/sql/UserModel.js
import { mysqlConnection } from "../../../bds/mysql.js";

// Crear usuario
export const createUser = async (user) => {
  const [result] = await mysqlConnection.execute(
    "INSERT INTO Miembro (nombre, apellido, correo, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)",
    [user.nombre, user.apellido, user.correo, user.contrasena, user.tipo_usuario]
  );
  return result.insertId;
};

// Buscar usuario por email
export const findUserByEmail = async (correo) => {
  const [rows] = await mysqlConnection.execute(
    "SELECT * FROM Miembro WHERE correo = ? LIMIT 1",
    [correo]
  );
  return rows[0];
};
