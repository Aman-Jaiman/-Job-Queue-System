import { QueueEvents } from "bullmq";

import bullMQConfig from "../config/bullmq.js";
import logger from "../config/logger.js";

const emailQueueEvents = new QueueEvents("email", bullMQConfig);

emailQueueEvents.on("waiting", ({ jobId }) => {
  logger.info(`[QUEUE] Job ${jobId} is waiting`);
});

emailQueueEvents.on("stalled", ({ jobId }) => {
  logger.warn(`[QUEUE] Job ${jobId} stalled`);
});

export default emailQueueEvents;
