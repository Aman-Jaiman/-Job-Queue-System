import logger from "./config/logger.js";
import emailQueue from "./queues/email.queue.js";
import startEmailScheduler from "./schedulers/email.scheduler.js";

try {
  // Job Scheduler metadata is persisted in Redis. This command can be run
  // independently during deployment; upsert keeps repeated runs idempotent.
  await startEmailScheduler();
  await emailQueue.close();
} catch (error) {
  logger.error(`Unable to configure email scheduler: ${error.message}`);
  process.exitCode = 1;
}
