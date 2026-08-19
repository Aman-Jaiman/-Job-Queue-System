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

describe("Queue API", () => {
  test("should get queue statistics", async () => {
    const response = await request(app)
      .get("/api/queue/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.stats).toBeDefined();

    expect(response.body.stats).toHaveProperty("waiting");
    expect(response.body.stats).toHaveProperty("active");
    expect(response.body.stats).toHaveProperty("completed");
    expect(response.body.stats).toHaveProperty("failed");
    expect(response.body.stats).toHaveProperty("delayed");
    expect(response.body.stats).toHaveProperty("paused");
  });

  test("should pause the queue", async () => {
    const response = await request(app)
      .post("/api/queue/pause")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Queue paused successfully");
  });

  test("should resume the queue", async () => {
    const response = await request(app)
      .post("/api/queue/resume")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Queue resumed successfully");
  });

  test("should empty the queue", async () => {
    const response = await request(app)
      .post("/api/queue/empty")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe(
      "Waiting and delayed jobs emptied successfully",
    );
  });

  test("should fail without token", async () => {
    const response = await request(app).get("/api/queue/stats");

    expect(response.statusCode).toBe(401);
  });

  test("should fail with invalid token", async () => {
    const response = await request(app)
      .get("/api/queue/stats")
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
  });
});
