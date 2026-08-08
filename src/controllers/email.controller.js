import emailQueue from "../queues/email.queue.js";
import logger from "../config/logger.js";

export const addEmailJob = async (req, res, next) => {
    try {
        const { to, subject, text, html } = req.body;

        const job = await emailQueue.add(
            "send-email",
            {
                to,
                subject,
                text,
                html,
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000,
                },
                removeOnComplete: {
                    age: 3600,
                    count: 1000,
                },
                removeOnFail: {
                    age: 86400,
                    count: 5000,
                },
            }
        );

        logger.info(`Email job created: ${job.id}`);

        return res.status(202).json({
            success: true,
            message: "Email job added successfully",
            jobId: job.id,
        });

    } catch (error) {
        next(error);
    }
};