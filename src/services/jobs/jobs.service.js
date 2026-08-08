import emailQueue from "../../queues/email.queue.js";
import AppError from "../../utils/AppError.js";

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

    await job.remove();
};

export const retryJobService = async (id) => {
    const job = await findJob(id);

    const state = await job.getState();

    if (state !== "failed") {
        throw new AppError(
            "Only failed jobs can be retried",
            400
        );
    }

    await job.retry();
};

export const getAllJobsService = async () => {
    const jobs = await emailQueue.getJobs([
        "waiting",
        "active",
        "completed",
        "failed",
        "delayed",
        "paused",
    ]);

    return jobs.map((job) => ({
        id: job.id,
        name: job.name,
        state: job.finishedOn ? "completed" : "processing",
        attemptsMade: job.attemptsMade,
        timestamp: job.timestamp,
        data: job.data,
    }));
};