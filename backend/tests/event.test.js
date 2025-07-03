import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { pool } from "../database/conecction.js";
import * as eventModel from "../models/eventModel.js";

let authToken;
beforeAll(async () => {
  const email = `test${Date.now()}@test.com`;
  const password = "123456";

  await request(app).post("/users/register").send({ email, password });

  const [rows] = await pool.query(
    "SELECT confirmation_token FROM users WHERE email = ?",
    [email]
  );
  const confirmationToken = rows[0].confirmation_token;

  await request(app).get(`/users/confirm?token=${confirmationToken}`);

  const res = await request(app).post("/users/login").send({ email, password });

  authToken = res.body.token;
});

afterAll(async () => {
  await pool.query(
    `DELETE FROM users
      WHERE email LIKE 'test%@test.com'`
  );
  await pool.end();
});
describe("Event handlers", () => {
  it("should create an event successfully", async () => {
    vi.spyOn(eventModel, "createEvent").mockResolvedValue(123);
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "My Event",
        description: "Test description",
        date: "2025-12-31",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("eventId", 123);
  });

  it("should fail to create event without title", async () => {
    const res = await request(app)
      .post("/events")
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Title is required");
  });
});
