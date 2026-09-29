import logger from "./config/logger.js";
import emailWorker, {
  waitForPendingDLQTransfers,
} from "./workers/email.worker.js";
import gracefulShutdown from "./utils/gracefulShutdown.js";
import emailQueue from "./queues/email.queue.js";
import dlqQueue from "./queues/dlq.queue.js";

logger.info("Worker process started...");

const shutdown = () =>
  gracefulShutdown(emailWorker, {
    queues: [emailQueue, dlqQueue],
    waitForBackgroundWork: waitForPendingDLQTransfers,
  });

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
