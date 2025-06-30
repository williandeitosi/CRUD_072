import { pool } from "../database/conecction";

export async function createEvent(title, description, date, userId) {
  const [result] = pool.query(
    `INSERT INTO events (title, description, date, userId) VALUES (?,?,?,?)`[
      (title, description, date, userId)
    ]
  );

  return result.insertId;
}
