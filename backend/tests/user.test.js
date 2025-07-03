import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("User flow", () => {
  let testEmail = `test${Date.now()}@test.com`;
  let testPassword = "112233";
  let testConfirmationToken;
  it("should register a user", async () => {
    const res = await request(app).post("/users/register").send({
      email: testEmail,
      password: testPassword,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(
      "Registered user. Confirm your email to access."
    );
  });
  it("should fail if email already exists", async () => {
    await request(app).post("/users/register").send({
      email: "testduplicate@test.com",
      password: "112233",
    });

    const res = await request(app).post("/users/register").send({
      email: "testduplicate@test.com",
      password: "112233",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch("User already exists!");
  });

  it("should fail registration without email and password", async () => {
    const res = await request(app).post("/users/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Email and password is required");
  });

  it("Should get confirmation token from DB", async () => {
    const { pool } = await import("../database/conecction.js");
    const [rows] = await pool.query(
      `SELECT confirmation_token FROM users WHERE email = ?`,
      [testEmail]
    );
    expect(rows[0]).toHaveProperty("confirmation_token");
    testConfirmationToken = rows[0].confirmation_token;
  });

  it("Should confirm user account", async () => {
    const res = await request(app).get(
      `/users/confirm?token=${testConfirmationToken}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("Account confirmed! You can now login.");
  });

  it("should fail account confirmation with invalid token", async () => {
    const res = await request(app).get("/users/confirm?token=invalidtoken123");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch("Invalid Token!");
  });

  it("should fail account confirmation without token", async () => {
    const res = await request(app).get("/users/confirm");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Token is required");
  });

  it("Should login successfully", async () => {
    const res = await request(app).post("/users/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login for nonexistent user", async () => {
    const res = await request(app).post("/users/login").send({
      email: "noone@notfound.com",
      password: "112233",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch("User not found");
  });

  it("should fail login with invalid password", async () => {
    const testEmail = `failpass${Date.now()}@test.com`;

    await request(app).post("/users/register").send({
      email: testEmail,
      password: "correctpass",
    });

    const { pool } = await import("../database/conecction.js");
    await pool.query(`UPDATE users SET confirmed=1 WHERE email = ?`, [
      testEmail,
    ]);

    const res = await request(app).post("/users/login").send({
      email: testEmail,
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid password/i);
  });
});
