import request from "supertest";
import app from "../src/app.js";

let token;

beforeAll(async () => {
    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email: "admin@example.com",
            password: "admin123",
        });

    token = login.body.token;
});

describe("Dead Letter Queue API", () => {

    test("should get all failed jobs", async () => {

        const response = await request(app)
            .get("/api/dlq")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.jobs).toBeDefined();

        expect(Array.isArray(response.body.jobs)).toBe(true);
    });

    test("should fail without token", async () => {

        const response = await request(app)
            .get("/api/dlq");

        expect(response.statusCode).toBe(401);
    });

    test("should fail with invalid token", async () => {

        const response = await request(app)
            .get("/api/dlq")
            .set("Authorization", "Bearer invalid_token");

        expect(response.statusCode).toBe(401);
    });

});