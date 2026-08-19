import emailQueue from "../../queues/email.queue.js";
import dlqQueue from "../../queues/dlq.queue.js";
import AppError from "../../utils/AppError.js";
import { getDLQJobId } from "../dlq/dlq.service.js";

export const findJob = async (id) => {
  const job = await emailQueue.getJob(id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return job;
};

export const getJobById = async (id) => {
  const job = await findJob(id);

  return {
    id: job.id,
    name: job.name,
    data: job.data,
    attemptsMade: job.attemptsMade,
    timestamp: job.timestamp,
  };
};

export const getJobStateService = async (id) => {
  const job = await findJob(id);

  return await job.getState();
};

export const deleteJobService = async (id) => {
  const job = await findJob(id);

  if ((await job.getState()) === "active") {
    throw new AppError("An active job cannot be deleted", 409);
  }

  await job.remove();
};

export const retryJobService = async (id) => {
  const job = await findJob(id);

  const state = await job.getState();

  if (state !== "failed") {
    throw new AppError("Only failed jobs can be retried", 400);
  }

  // Failed email jobs are represented in the DLQ. Retrying the original
  // failed job would bypass its DLQ lifecycle and could create a duplicate
  // DLQ record after its next final failure.
  if (await dlqQueue.getJob(getDLQJobId(job))) {
    throw new AppError(
      "Job is in the DLQ; retry it through the DLQ endpoint",
      409,
    );
  }

  await job.retry();
};

export const getAllJobsService = async (limit) => {
  const jobs = await emailQueue.getJobs(
    ["waiting", "active", "completed", "failed", "delayed", "paused"],
    0,
    limit - 1,
  );

  return Promise.all(
    jobs.map(async (job) => ({
      id: job.id,
      name: job.name,
      state: await job.getState(),
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      data: job.data,
    })),
  );
};
