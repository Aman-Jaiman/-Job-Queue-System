import request from "supertest";
import app from "../src/app.js";
import { generateToken } from "../src/utils/jwt.js";

describe("Authentication", () => {
  describe("POST /api/auth/login", () => {
    test("should login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "admin123",
      });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.token).toBeDefined();
    });

    test("should fail with invalid password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(401);
    });

    test("should fail when email is missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "admin123",
      });

      expect(response.statusCode).toBe(400);
    });

    test("should fail when password is missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
      });

      expect(response.statusCode).toBe(400);
    });
  });

  test("should reject a valid token without the admin role", async () => {
    const token = generateToken({
      email: "user@example.com",
      role: "user",
    });

    const response = await request(app)
      .get("/api/jobs")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
