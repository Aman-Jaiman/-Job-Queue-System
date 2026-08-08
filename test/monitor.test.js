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

describe("Monitor API", () => {

    test("should get monitoring information", async () => {

        const response = await request(app)
            .get("/api/monitor")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

    });

    test("should contain queue metrics", async () => {

        const response = await request(app)
            .get("/api/monitor")
            .set("Authorization", `Bearer ${token}`);

        expect(response.body.queue).toBeDefined();

        expect(response.body.queue).toHaveProperty("waiting");
        expect(response.body.queue).toHaveProperty("active");
        expect(response.body.queue).toHaveProperty("completed");
        expect(response.body.queue).toHaveProperty("failed");
        expect(response.body.queue).toHaveProperty("delayed");

    });

    test("should contain worker metrics", async () => {

        const response = await request(app)
            .get("/api/monitor")
            .set("Authorization", `Bearer ${token}`);

        expect(response.body.worker).toBeDefined();

    });

    test("should contain redis status", async () => {

        const response = await request(app)
            .get("/api/monitor")
            .set("Authorization", `Bearer ${token}`);

        expect(response.body.redis).toBeDefined();

        expect(response.body.redis.status).toBe("connected");

    });

    test("should fail without authentication", async () => {

        const response = await request(app)
            .get("/api/monitor");

        expect(response.statusCode).toBe(401);

    });

    test("should fail with invalid token", async () => {

        const response = await request(app)
            .get("/api/monitor")
            .set("Authorization", "Bearer invalid_token");

        expect(response.statusCode).toBe(401);

    });

});