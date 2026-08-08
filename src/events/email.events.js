import { QueueEvents } from "bullmq";

import bullMQConfig from "../config/bullmq.js";
import logger from "../config/logger.js";

const emailQueueEvents = new QueueEvents("email", bullMQConfig);

emailQueueEvents.on("active", ({ jobId }) => {
    logger.info(`Job ${jobId} started`);
});

emailQueueEvents.on("waiting", ({ jobId }) => {
    logger.info(`Job ${jobId} is waiting`);
});

emailQueueEvents.on("completed", ({ jobId }) => {
    logger.info(`Job ${jobId} completed`);
});

emailQueueEvents.on("failed", ({ jobId, failedReason }) => {
    logger.error(`Job ${jobId} failed`);
    logger.error(`Reason: ${failedReason}`);
});

emailQueueEvents.on("stalled", ({ jobId }) => {
    logger.warn(`Job ${jobId} stalled`);
});

export default emailQueueEvents;