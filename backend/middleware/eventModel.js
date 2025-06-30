import { pool } from "../database/conecction";

export async function createEvent(title, description, date, userId) {
  const [result] = await pool.query(
    `INSERT INTO events (title, description, date, userId) VALUES (?,?,?,?)`[
      (title, description, date, userId)
    ]
  );

  return result.insertId;
}

export async function getEventsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM events WHERE user_id = ? ORDER BY date ASC`,
    [userId]
  );
  return rows;
}
