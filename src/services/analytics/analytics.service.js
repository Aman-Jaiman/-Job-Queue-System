import emailQueue from "../../queues/email.queue.js";

export const getQueueAnalytics = async () => {

    const counts = await emailQueue.getJobCounts(
        "waiting",
        "active",
        "completed",
        "failed",
        "delayed",
        "paused"
    );

    const total =
        counts.waiting +
        counts.active +
        counts.completed +
        counts.failed +
        counts.delayed +
        counts.paused;

    const successRate =
        total === 0
            ? 0
            : ((counts.completed / total) * 100).toFixed(2);

    const failureRate =
        total === 0
            ? 0
            : ((counts.failed / total) * 100).toFixed(2);

    return {
        total,
        ...counts,
        successRate,
        failureRate,
    };
};