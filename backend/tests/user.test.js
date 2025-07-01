import request from "supertest";
import { describe, it } from "vitest";
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
  }, 10000);
  console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
});
