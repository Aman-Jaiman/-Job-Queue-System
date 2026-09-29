import request from "supertest";
import app from "../src/app.js";

describe("Health Check", () => {
  describe("GET /health", () => {
    test("should return healthy status", async () => {
      const response = await request(app).get("/health");

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe("ok");
      expect(response.body.service).toBe("job-queue-system");

      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("timestamp");

      expect(response.body.services).toBeDefined();

      expect(response.body.services).toHaveProperty("redis");
      expect(response.body.services).toHaveProperty("queue");

      expect(response.body.services.redis).toBe("ready");
      expect(response.body.services.queue).toBe("connected");
    });

    test("should not require authentication", async () => {
      const response = await request(app).get("/health");

      expect(response.statusCode).not.toBe(401);
      expect(response.statusCode).not.toBe(403);
    });

    test("should return valid timestamp", async () => {
      const response = await request(app).get("/health");

      expect(response.body.timestamp).toBeDefined();

      const timestamp = new Date(response.body.timestamp);

      expect(timestamp.toString()).not.toBe("Invalid Date");
    });

    test("should return uptime as a number", async () => {
      const response = await request(app).get("/health");

      expect(typeof response.body.uptime).toBe("number");
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
