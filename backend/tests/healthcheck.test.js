import request from "supertest";
import { describe, it } from "vitest";
import app from "../app.js";

describe("Healthcheck", () => {
  it("Should return status ok", async () => {
    const res = await request(app).get("/healthcheck");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
