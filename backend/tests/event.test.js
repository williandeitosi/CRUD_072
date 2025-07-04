import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import app from "../app.js";
import * as eventModel from "../models/eventModel.js";

const authToken = "Bearer faketoken";

vi.mock("../middleware/authMiddleware.js", () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1 };
    next();
  },
}));

describe("Event handlers (mocked)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create an event successfully", async () => {
    vi.spyOn(eventModel, "createEvent").mockResolvedValue(123);

    const res = await request(app)
      .post("/events")
      .set("Authorization", authToken)
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
      .set("Authorization", authToken)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Title is required");
  });

  it("should handle createEventHandler errors", async () => {
    vi.spyOn(eventModel, "createEvent").mockRejectedValue(new Error("fail"));

    const res = await request(app)
      .post("/events")
      .set("Authorization", authToken)
      .send({
        title: "fail test",
        description: "desc",
        date: "2025-12-31",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch("Error creating event");
  });

  it("should list events", async () => {
    vi.spyOn(eventModel, "getEventsByUser").mockResolvedValue([
      { id: 1, title: "Test Event" },
    ]);

    const res = await request(app)
      .get("/events/all")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.allEvents).toBeInstanceOf(Array);
  });

  it("should return 404 if no events", async () => {
    vi.spyOn(eventModel, "getEventsByUser").mockResolvedValue(null);

    const res = await request(app)
      .get("/events/all")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch("Event not found");
  });
});
