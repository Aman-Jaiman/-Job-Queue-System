import request from "supertest";
import app from "../src/app.js";

let token;

beforeAll(async () => {
  const login = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "admin123",
  });

  token = login.body.token;
});

describe("Analytics API", () => {
  test("should get queue analytics", async () => {
    const response = await request(app)
      .get("/api/analytics")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.analytics).toBeDefined();
  });

  test("should contain total jobs", async () => {
    const response = await request(app)
      .get("/api/analytics")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.analytics.total).toBeDefined();

    expect(typeof response.body.analytics.total).toBe("number");
  });

  test("should contain all queue counts", async () => {
    const response = await request(app)
      .get("/api/analytics")
      .set("Authorization", `Bearer ${token}`);

    const analytics = response.body.analytics;

    expect(analytics).toHaveProperty("waiting");
    expect(analytics).toHaveProperty("active");
    expect(analytics).toHaveProperty("completed");
    expect(analytics).toHaveProperty("failed");
    expect(analytics).toHaveProperty("delayed");
    expect(analytics).toHaveProperty("paused");
  });

  test("should contain success and failure rates", async () => {
    const response = await request(app)
      .get("/api/analytics")
      .set("Authorization", `Bearer ${token}`);

    const analytics = response.body.analytics;

    expect(analytics).toHaveProperty("successRate");
    expect(analytics).toHaveProperty("failureRate");
  });

  test("should fail without authentication", async () => {
    const response = await request(app).get("/api/analytics");

    expect(response.statusCode).toBe(401);
  });

  test("should fail with invalid token", async () => {
    const response = await request(app)
      .get("/api/analytics")
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
  });
});
