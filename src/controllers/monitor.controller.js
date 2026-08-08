import emailQueue from "../queues/email.queue.js";
import { getWorkerMetrics } from "../services/monitor/monitor.service.js";

export const getMonitor = async (req, res, next) => {

    try {

        const counts = await emailQueue.getJobCounts(
            "waiting",
            "active",
            "completed",
            "failed",
            "delayed"
        );

        return res.status(200).json({

            success: true,

            queue: counts,

            worker: getWorkerMetrics(),

            redis: {
                status: "connected",
            }

        });

    } catch (error) {
        next(error);
    }

};