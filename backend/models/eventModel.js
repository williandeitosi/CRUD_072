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
    `SELECT * FROM events WHERE user_id = ? ORDER BY id ASC`,
    [userId]
  );
  return rows;
}

export async function updateEvent(fields, eventId, userId) {
  const updates = [];
  const values = [];

  if (fields.title !== undefined) {
    updates.push("title = ?");
    values.push(fields.title);
  }
  if (fields.description !== undefined) {
    updates.push("description = ?");
    values.push(fields.description);
  }
  if (fields.date !== undefined) {
    updates.push("date = ?");
    values.push(fields.date);
  }

  if (updates.length === 0) {
    return false;
  }

  values.push(eventId, userId);

  const query = `
    UPDATE events
    SET ${updates.join(", ")}
    WHERE id = ? AND user_id = ?
  `;

  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
}

export async function deleteEvent(eventId, userId) {
  const [result] = await pool.query(
    `DELETE FROM events WHERE id = ? AND user_id = ?`,
    [eventId, userId]
  );

  return result.affectedRows > 0;
}
