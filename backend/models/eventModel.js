import { pool } from "../database/conecction.js";

export async function createEvent(title, description, date, userId) {
  const [result] = await pool.query(
    `INSERT INTO events (title, description, date, user_id) VALUES (?,?,?,?)`,
    [title, description, date, userId]
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

export async function updateEvent(eventId, userId) {
  const [result] = await pool.query(
    `UPDATE events SET title = ?, description = ?, date = ? WHERE id = ? AND user_id = ?`,
    [title, description, date, eventId, userId]
  );

  return result.affectedRows > 0;
}

export async function deleteEvent(eventId, userId) {
  const [result] = await pool.query(
    `DELETE FROM events WHERE id = ? AND user_id = ?`,
    [eventId, userId]
  );

  return result.affectedRows > 0;
}

export async function getAllEventsByUser(userId) {
  const [result] = await pool.query(
    `SELECT * FROM events WHERE user_id = ? ORDER BY id ASC`,
    [userId]
  );

  return result;
}
