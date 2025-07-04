import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { RateLimiterMemory } from "rate-limiter-flexible";
import {
  confirmUser,
  createUser,
  findUserByEmail,
} from "../models/userModel.js";
import { sendWelcomeEmail } from "../utils/email.js";

const loginRateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 15 * 60,
});

export async function registerUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res
        .status(400)
        .json({ message: "Email and password is required" });
    }

    const existing = await findUserByEmail(email);

    if (existing) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hash = await bcrypt.hash(password, 10);

    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const userId = await createUser(email, hash, confirmationToken);

    await sendWelcomeEmail(email, confirmationToken);

    res.status(201).json({
      message: "Registered user. Confirm your email to access.",
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
}

export async function confirmAccount(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const ok = await confirmUser(token);

    if (!ok) {
      return res.status(404).json({ message: "Invalid Token!" });
    }
    res.status(200).json({ message: "Account confirmed! You can now login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error confirming account" });
  }
}

export async function loginUser(req, res) {
  const ip = req.ip;
  if (process.env.NODE_ENV !== "test") {
    try {
      await loginRateLimiter.consume(ip);
    } catch {
      return res.status(429).json({
        message: "Too many login attempts. Please try again later.",
      });
    }
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      await loginRateLimiter.consume(ip);
      return res
        .status(400)
        .json({ message: "Email and password is required" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      await loginRateLimiter.consume(ip);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.confirmed) {
      await loginRateLimiter.consume(ip);
      return res
        .status(403)
        .json({ message: "Please confirm your email before accessing" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      await loginRateLimiter.consume(ip);
      return res.status(401).json({ message: "Email and password id wrong" });
    }

    await loginRateLimiter.delete(ip);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error" });
  }
}
