import request from "supertest";
import app from "../src/app.js";

describe("Request ID Middleware", () => {
  test("should generate request ID when not provided", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);

    expect(response.headers["x-request-id"]).toBeDefined();
    expect(response.headers["x-request-id"].length).toBeGreaterThan(0);
  });

  test("should preserve client provided request ID", async () => {
    const requestId = "test-request-123";

    const response = await request(app)
      .get("/health")
      .set("X-Request-ID", requestId);

    expect(response.statusCode).toBe(200);

    expect(response.headers["x-request-id"]).toBe(requestId);
  });
});
