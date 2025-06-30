import { pool } from "../database/conecction.js";

export async function createUser(email, passwordHash, confirmationToken) {
  const [result] = await pool.query(
    `INSERT INTO users (email, password, confirmation_token, confirmed) VALUE (?,?,?,?)`,
    [email, passwordHash, confirmationToken, 0]
  );
  return result.insertId;
}

export async function confirmUser(token) {
  const [result] = await pool.query(
    `UPDATE users SET confirmed = 1 WHERE confirmation_token = ?`,
    [token]
  );
  return result.affectedRows > 0;
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);

  return rows[0];
}
