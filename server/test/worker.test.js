import { jest } from "@jest/globals";

const sendAttempts = [];

jest.unstable_mockModule("../src/services/mail/email.service.js", () => ({
  default: jest.fn(async ({ to }) => {
    sendAttempts.push(Date.now());

    if (to === "fail@example.com") {
      throw new Error("Simulated mail provider failure");
    }

    return { messageId: "test-message" };
  }),
}));

const { default: emailWorker, waitForPendingDLQTransfers } =
  await import("../src/workers/email.worker.js");
const { default: emailQueue } = await import("../src/queues/email.queue.js");
const { default: dlqQueue } = await import("../src/queues/dlq.queue.js");
const { getDLQJobId, moveToDLQ } =
  await import("../src/services/dlq/dlq.service.js");

const waitForState = async (jobId, expectedState) => {
  const deadline = Date.now() + 5000;

  while (Date.now() < deadline) {
    const job = await emailQueue.getJob(jobId);

    if (job && (await job.getState()) === expectedState) {
      return job;
    }

    await new Promise((resolve) => setTimeout(resolve, 25));
  }

  throw new Error(`Job ${jobId} did not reach ${expectedState}`);
};

afterAll(async () => {
  await emailWorker.close();
});

describe("Email worker lifecycle", () => {
  test("processes a scheduled report job successfully", async () => {
    const job = await emailQueue.add("daily-report", { type: "report" });
    const completedJob = await waitForState(job.id, "completed");

    expect(completedJob.returnvalue).toEqual({
      type: "daily-report",
      status: "generated",
    });
  });

  test("retries a failed email with backoff and records one DLQ job", async () => {
    sendAttempts.length = 0;

    const job = await emailQueue.add(
      "send-email",
      {
        to: "fail@example.com",
        subject: "Failure test",
        text: "Test",
      },
      {
        attempts: 2,
        backoff: { type: "fixed", delay: 100 },
        removeOnFail: false,
      },
    );
    const failedJob = await waitForState(job.id, "failed");

    await waitForPendingDLQTransfers();

    const dlqJobId = getDLQJobId(failedJob);
    const dlqJob = await dlqQueue.getJob(dlqJobId);

    expect(failedJob.attemptsMade).toBe(2);
    expect(sendAttempts).toHaveLength(2);
    expect(sendAttempts[1] - sendAttempts[0]).toBeGreaterThanOrEqual(75);
    expect(dlqJob).toBeDefined();
    expect(dlqJob.data.originalJobId).toBe(job.id);

    // A repeated final-failure notification must not create a second DLQ job.
    await moveToDLQ(failedJob, "Simulated mail provider failure");
    expect(await dlqQueue.getJob(dlqJobId)).toBeDefined();
    expect(
      (await dlqQueue.getJobs(["waiting"])).filter(
        (item) => item.id === dlqJobId,
      ),
    ).toHaveLength(1);
  });
});
