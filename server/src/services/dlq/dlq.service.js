import dlqQueue from "../../queues/dlq.queue.js";
import logger from "../../config/logger.js";
import emailQueue from "../../queues/email.queue.js";

const stableJobId = (prefix, value) =>
  `${prefix}-${Buffer.from(String(value)).toString("base64url")}`;

// A final failure can be observed more than once after a worker recovery or a
// manual retry. A deterministic ID makes DLQ insertion idempotent in Redis.
export const getDLQJobId = (job) =>
  stableJobId("dlq", `${job.queueName}:${job.id}`);

export const moveToDLQ = async (job, reason) => {
  const dlqJobId = getDLQJobId(job);

  await dlqQueue.add(
    "failed-job",
    {
      originalJobId: job.id,
      originalQueue: job.queueName,
      jobName: job.name,
      data: job.data,
      attemptsMade: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      failedReason: reason,
      failedAt: new Date().toISOString(),
    },
    {
      jobId: dlqJobId,
      attempts: 1,
      removeOnComplete: false,
      removeOnFail: false,
    },
  );

  logger.warn(`Job ${job.id} recorded in the DLQ`);
};

export const getDLQJobs = async (limit) => {
  return await dlqQueue.getJobs(
    ["waiting", "active", "completed", "failed", "delayed"],
    0,
    limit - 1,
  );
};

export const getDLQJob = async (id) => {
  return await dlqQueue.getJob(id);
};

export const deleteDLQJob = async (id) => {
  const job = await dlqQueue.getJob(id);

  if (!job) {
    return null;
  }

  await job.remove();

  logger.info(`DLQ Job ${id} deleted`);

  return true;
};

export const retryDLQJob = async (id) => {
  const dlqJob = await dlqQueue.getJob(id);

  if (!dlqJob) {
    return null;
  }

  await emailQueue.add(dlqJob.data.jobName, dlqJob.data.data, {
    // Repeated admin requests resolve to the same job instead of
    // duplicating work while the DLQ record is being removed.
    jobId: stableJobId("dlq-retry", dlqJob.id),
    attempts: dlqJob.data.maxAttempts,

    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });

  try {
    await dlqJob.remove();
  } catch (error) {
    // Another concurrent retry may already have removed this record. The
    // deterministic email job above means no duplicate work was created.
    const remainingJob = await dlqQueue.getJob(id);

    if (remainingJob) {
      throw error;
    }
  }

  logger.info(`DLQ Job ${id} moved back to Email Queue`);

  return true;
};

export const getDLQStats = async () => {
  return await dlqQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
  );
};
