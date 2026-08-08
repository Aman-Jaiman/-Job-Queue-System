import request from "supertest";
import app from "../src/app.js";

let token;
let jobId;

beforeAll(async () => {
    // Login
    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email: "admin@example.com",
            password: "admin123",
        });

    token = login.body.token;

    // Create one email job
    const job = await request(app)
        .post("/api/email")
        .set("Authorization", `Bearer ${token}`)
        .send({
            to: "test@example.com",
            subject: "Jobs API Test",
            text: "Testing Jobs",
            html: "<h1>Testing Jobs</h1>",
        });

    jobId = job.body.jobId;
});

describe("Jobs API", () => {

    test("should get all jobs", async () => {

        const response = await request(app)
            .get("/api/jobs")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.jobs)).toBe(true);
    });

    test("should get a job by id", async () => {

        const response = await request(app)
            .get(`/api/jobs/${jobId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.id).toBeDefined();
    });

    test("should return 404 for invalid job id", async () => {

        const response = await request(app)
            .get("/api/jobs/999999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
    });

    test("should get job state", async () => {

        const response = await request(app)
            .get(`/api/jobs/${jobId}/state`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.state).toBeDefined();
    });

});