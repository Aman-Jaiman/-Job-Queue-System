import request from "supertest";
import app from "../src/app.js";

let token;

beforeAll(async () => {
  const response = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "admin123",
  });

  token = response.body.token;
});

describe("Email Queue", () => {
  test("should queue email successfully", async () => {
    const response = await request(app)
      .post("/api/email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        to: "test@example.com",
        subject: "Testing Email Queue",
        text: "Hello from Jest",
        html: "<h1>Hello from Jest</h1>",
      });

    expect(response.statusCode).toBe(202);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Email job added successfully");

    expect(response.body.jobId).toBeDefined();
  });

  test("should fail when email is invalid", async () => {
    const response = await request(app)
      .post("/api/email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        to: "invalid-email",
        subject: "Testing",
        text: "Hello",
        html: "<h1>Hello</h1>",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);
  });

  test("should fail when subject is missing", async () => {
    const response = await request(app)
      .post("/api/email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        to: "test@example.com",
        text: "Hello",
        html: "<h1>Hello</h1>",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);
  });

  test("should fail when text is missing", async () => {
    const response = await request(app)
      .post("/api/email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        to: "test@example.com",
        subject: "Testing",
        html: "<h1>Hello</h1>",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);
  });

  test("should queue a text-only email when html is omitted", async () => {
    const response = await request(app)
      .post("/api/email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        to: "test@example.com",
        subject: "Testing",
        text: "Hello",
      });

    expect(response.statusCode).toBe(202);

    expect(response.body.success).toBe(true);
  });

  test("should fail when authorization token is missing", async () => {
    const response = await request(app).post("/api/email").send({
      to: "test@example.com",
      subject: "Testing",
      text: "Hello",
      html: "<h1>Hello</h1>",
    });

    expect(response.statusCode).toBe(401);
  });
});
