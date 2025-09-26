// Backend/src/models/sql/UserModel.js
import pool from "../../db.js";
import bcrypt from "bcrypt";

/**
 * Crea un Miembro (usuario normal).
 */
export async function createUser({ nombre, apellido, correo, contrasena, tipo_usuario }) {
  let hashed = contrasena || "";
  if (typeof hashed === "string" && !/^(\$2[aby]?\$|\$argon2)/.test(hashed)) {
    hashed = await bcrypt.hash(hashed, 10);
  }

  try {
    const [r] = await pool.query(
      `INSERT INTO Miembro (nombre, apellido, correo, contrasena, tipo_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, hashed, tipo_usuario || "estudiante"]
    );
    return r.insertId;
  } catch (e) {
    console.error("❌ SQL createUser:", e);
    throw e;
  }
}

/**
 * Busca por correo. Prioriza Administrador; si no, Miembro.
 */
export async function findUserByEmail(correo) {
  try {
    const [admins] = await pool.query(
      `SELECT id_admin, correo, contrasena, tipo_admin
         FROM Administrador
        WHERE correo = ?
        LIMIT 1`,
      [correo]
    );
    if (admins.length) {
      const a = admins[0];
      return {
        id_usuario: a.id_admin,
        correo: a.correo,
        contrasena: a.contrasena,
        tipo_usuario: "admin",
        tipo_admin: a.tipo_admin,
        is_admin: 1
      };
    }
  } catch (e) {
    console.error("❌ SQL findUserByEmail[Administrador]:", e);
    throw e;
  }

  try {
    const [miembros] = await pool.query(
      `SELECT id_usuario, correo, contrasena, tipo_usuario
         FROM Miembro
        WHERE correo = ?
        LIMIT 1`,
      [correo]
    );
    if (miembros.length) {
      const m = miembros[0];
      return {
        id_usuario: m.id_usuario,
        correo: m.correo,
        contrasena: m.contrasena,
        tipo_usuario: m.tipo_usuario,
        is_admin: 0
      };
    }
    return null;
  } catch (e) {
    console.error("❌ SQL findUserByEmail[Miembro]:", e);
    throw e;
  }
}

/* ===== CRUD para userController (Miembro) ===== */

export async function getAllUsers() {
  try {
    const [rows] = await pool.query(
      `SELECT id_usuario, nombre, apellido, correo, tipo_usuario
         FROM Miembro
        ORDER BY id_usuario DESC`
    );
    return rows;
  } catch (e) {
    console.error("❌ SQL getAllUsers:", e);
    throw e;
  }
}

export async function getUserById(id) {
  try {
    const [rows] = await pool.query(
      `SELECT id_usuario, nombre, apellido, correo, tipo_usuario
         FROM Miembro
        WHERE id_usuario = ?
        LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  } catch (e) {
    console.error("❌ SQL getUserById:", e);
    throw e;
  }
}

export async function updateUserById(id, { nombre, apellido, correo, contrasena, tipo_usuario }) {
  const sets = [];
  const vals = [];

  if (nombre !== undefined)       { sets.push("nombre = ?");        vals.push(nombre); }
  if (apellido !== undefined)     { sets.push("apellido = ?");      vals.push(apellido); }
  if (correo !== undefined)       { sets.push("correo = ?");        vals.push(correo); }
  if (tipo_usuario !== undefined) { sets.push("tipo_usuario = ?");  vals.push(tipo_usuario); }

  if (contrasena) {
    const hashed = await bcrypt.hash(contrasena, 10);
    sets.push("contrasena = ?");
    vals.push(hashed);
  }

  if (sets.length === 0) return 0;

  vals.push(id);
  try {
    const [r] = await pool.query(
      `UPDATE Miembro SET ${sets.join(", ")} WHERE id_usuario = ?`,
      vals
    );
    return r.affectedRows;
  } catch (e) {
    console.error("❌ SQL updateUserById:", e);
    throw e;
  }
}

export async function deleteUserById(id) {
  try {
    const [r] = await pool.query(`DELETE FROM Miembro WHERE id_usuario = ?`, [id]);
    return r.affectedRows;
  } catch (e) {
    console.error("❌ SQL deleteUserById:", e);
    throw e;
  }
}

/* ===== Alias compatibles (no rompo nada) ===== */
export async function crearUsuario(usuario, email, contrasena) {
  const nombre = usuario || "";
  const apellido = "";
  return createUser({ nombre, apellido, correo: email, contrasena, tipo_usuario: "estudiante" });
}
export async function buscarUsuarioPorEmail(email) {
  return findUserByEmail(email);
}
