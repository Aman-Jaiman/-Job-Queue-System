import request from "supertest";
import app from "../src/app.js";
import dlqQueue from "../src/queues/dlq.queue.js";

describe("Dead Letter Queue (DLQ)", () => {
  let token;

  beforeAll(async () => {
    // Login as admin
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "admin123",
    });

    expect(response.statusCode).toBe(200);

    token = response.body.token;
  });

  afterAll(async () => {
    await dlqQueue.obliterate({ force: true });
  });

  describe("GET /api/dlq", () => {
    test("should get all DLQ jobs", async () => {
      const job = await dlqQueue.add(
        "failed-job",
        {
          originalJobId: "test-job-1",
          originalQueue: "email",
          jobName: "send-email",
          data: {
            to: "test@example.com",
            subject: "Test",
            text: "Test email",
            html: "<p>Test</p>",
          },
          attemptsMade: 3,
          maxAttempts: 3,
          failedReason: "Test failure",
          failedAt: new Date().toISOString(),
        },
        {
          removeOnComplete: false,
          removeOnFail: false,
        },
      );

      const response = await request(app)
        .get("/api/dlq")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.jobs)).toBe(true);

      const foundJob = response.body.jobs.find((item) => item.id === job.id);

      expect(foundJob).toBeDefined();
      expect(foundJob.name).toBe("failed-job");
    });
  });

  describe("GET /api/dlq/stats", () => {
    test("should return DLQ statistics", async () => {
      const response = await request(app)
        .get("/api/dlq/stats")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.stats).toHaveProperty("waiting");
      expect(response.body.stats).toHaveProperty("active");
      expect(response.body.stats).toHaveProperty("completed");
      expect(response.body.stats).toHaveProperty("failed");
      expect(response.body.stats).toHaveProperty("delayed");
    });
  });

  describe("GET /api/dlq/:id", () => {
    test("should get a DLQ job by id", async () => {
      const job = await dlqQueue.add(
        "failed-job",
        {
          originalJobId: "test-job-2",
          originalQueue: "email",
          jobName: "send-email",
          data: {
            to: "test@example.com",
            subject: "Test",
            text: "Test",
            html: "<p>Test</p>",
          },
          attemptsMade: 3,
          maxAttempts: 3,
          failedReason: "Test failure",
          failedAt: new Date().toISOString(),
        },
        {
          removeOnComplete: false,
          removeOnFail: false,
        },
      );

      const response = await request(app)
        .get(`/api/dlq/${job.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.job).toBeDefined();
      expect(response.body.job.id).toBe(job.id);
    });

    test("should return 404 when DLQ job does not exist", async () => {
      const response = await request(app)
        .get("/api/dlq/non-existent-job-id")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/dlq/:id", () => {
    test("should delete a DLQ job", async () => {
      const job = await dlqQueue.add(
        "failed-job",
        {
          originalJobId: "test-job-3",
          originalQueue: "email",
          jobName: "send-email",
          data: {
            to: "test@example.com",
            subject: "Delete Test",
            text: "Delete test",
            html: "<p>Delete test</p>",
          },
          attemptsMade: 3,
          maxAttempts: 3,
          failedReason: "Test failure",
          failedAt: new Date().toISOString(),
        },
        {
          removeOnComplete: false,
          removeOnFail: false,
        },
      );

      const response = await request(app)
        .delete(`/api/dlq/${job.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("DLQ Job deleted successfully");

      const deletedJob = await dlqQueue.getJob(job.id);

      expect(deletedJob).toBeUndefined();
    });

    test("should return 404 when deleting non-existent job", async () => {
      const response = await request(app)
        .delete("/api/dlq/non-existent-job-id")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/dlq/:id/retry", () => {
    test("should retry a DLQ job successfully", async () => {
      const job = await dlqQueue.add(
        "failed-job",
        {
          originalJobId: "test-job-4",
          originalQueue: "email",
          jobName: "send-email",
          data: {
            to: "test@example.com",
            subject: "Retry Test",
            text: "Retry test",
            html: "<p>Retry test</p>",
          },
          attemptsMade: 3,
          maxAttempts: 3,
          failedReason: "Test failure",
          failedAt: new Date().toISOString(),
        },
        {
          removeOnComplete: false,
          removeOnFail: false,
        },
      );

      const response = await request(app)
        .post(`/api/dlq/${job.id}/retry`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("DLQ Job retried successfully");

      const removedDLQJob = await dlqQueue.getJob(job.id);

      expect(removedDLQJob).toBeUndefined();
    });

    test("should return 404 when retrying non-existent job", async () => {
      const response = await request(app)
        .post("/api/dlq/non-existent-job-id/retry")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DLQ Authentication", () => {
    test("should reject request without authentication", async () => {
      const response = await request(app).get("/api/dlq");

      expect(response.statusCode).toBe(401);
    });
  });
});
