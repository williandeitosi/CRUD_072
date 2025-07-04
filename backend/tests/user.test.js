import bcrypt from "bcrypt";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app.js";
import * as userModel from "../models/userModel.js";
import * as emailUtil from "../utils/email.js";

describe("User flow (mocked)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should register a user", async () => {
    vi.spyOn(userModel, "findUserByEmail").mockResolvedValue(null);
    vi.spyOn(userModel, "createUser").mockResolvedValue(1);
    vi.spyOn(emailUtil, "sendWelcomeEmail").mockResolvedValue();

    const res = await request(app).post("/users/register").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(
      "Registered user. Confirm your email to access."
    );
  });

  it("should fail if email already exists", async () => {
    vi.spyOn(userModel, "findUserByEmail").mockResolvedValue({ id: 1 });

    const res = await request(app).post("/users/register").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch("User already exists!");
  });

  it("should fail registration without email and password", async () => {
    const res = await request(app).post("/users/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Email and password is required");
  });

  it("should create user errors", async () => {
    vi.spyOn(userModel, "createUser").mockRejectedValue(new Error("fail"));

    const res = await request(app).post("/users/register").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch("Error registering user");
  });

  it("should confirm account", async () => {
    vi.spyOn(userModel, "confirmUser").mockResolvedValue(true);

    const res = await request(app).get("/users/confirm?token=faketoken");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("Account confirmed! You can now login.");
  });

  it("should fail confirm account without token", async () => {
    const res = await request(app).get("/users/confirm");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Token is required");
  });

  it("should fail confirm account with invalid token", async () => {
    vi.spyOn(userModel, "confirmUser").mockResolvedValue(false);

    const res = await request(app).get("/users/confirm?token=invalid");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch("Invalid Token!");
  });

  it("shoul confirm account error", async () => {
    vi.spyOn(userModel, "confirmUser").mockRejectedValue(new Error("fail"));

    const res = await request(app).get("/users/confirm?token=invalid");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch("Error confirming account");
  });

  it("should login successfully", async () => {
    vi.spyOn(userModel, "findUserByEmail").mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: "$2b$10$hash",
      confirmed: 1,
    });
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const res = await request(app).post("/users/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    vi.spyOn(userModel, "findUserByEmail").mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: "$2b$10$hash",
      confirmed: 1,
    });
    vi.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const res = await request(app).post("/users/login").send({
      email: "test@test.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch("Email and password id wrong");
  });

  it("should fail login if not confirmed", async () => {
    vi.spyOn(userModel, "findUserByEmail").mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: "$2b$10$hash",
      confirmed: 0,
    });

    const res = await request(app).post("/users/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(
      "Please confirm your email before accessing"
    );
  });

  it("should fail login if user not found", async () => {
    vi.spyOn(userModel, "findUserByEmail").mockResolvedValue(null);

    const res = await request(app).post("/users/login").send({
      email: "notfound@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch("User not found");
  });

  it("should fail login without email/password", async () => {
    const res = await request(app).post("/users/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Email and password is required");
  });

  it("should login error", async () => {
    vi.spyOn(userModel, "findUserByEmail").mockRejectedValue(new Error("fail"));
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const res = await request(app).post("/users/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch("Login error");
  });
});
