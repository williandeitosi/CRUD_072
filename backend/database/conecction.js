import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "crud072",
  waitForConnections: true,
  connectionLimit: 10,
});
