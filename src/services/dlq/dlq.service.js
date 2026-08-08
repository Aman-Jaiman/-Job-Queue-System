import dlqQueue from "../../queues/dlq.queue.js";
import logger from "../../config/logger.js";
import emailQueue from "../../queues/email.queue.js";

export const moveToDLQ = async (job, reason) => {
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
            removeOnComplete: false,
            removeOnFail: false,
        }
    );

    logger.warn(`Job ${job.id} moved to DLQ`);
};

export const getFailedJobs = async () => {
    return await dlqQueue.getJobs([
        "waiting",
        "active",
        "completed",
        "failed",
        "delayed",
    ]);
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

    await emailQueue.add(
        dlqJob.data.jobName,
        dlqJob.data.data,
        {
            attempts: dlqJob.data.maxAttempts,

            backoff: {
                type: "exponential",
                delay: 2000,
            },
        }
    );

    await dlqJob.remove();

    logger.info(
        `DLQ Job ${id} moved back to Email Queue`
    );

    return true;
};

export const getDLQStats = async () => {
    return await dlqQueue.getJobCounts(
        "waiting",
        "active",
        "completed",
        "failed",
        "delayed"
    );
};
