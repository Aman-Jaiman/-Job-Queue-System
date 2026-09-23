import app from "./src/app.js";
import config from "./src/config/env.js";
import logger from "./src/config/logger.js";
import redis from "./src/config/redis.js";
import emailQueue from "./src/queues/email.queue.js";
import emailWorker, {
  waitForPendingDLQTransfers,
} from "./src/workers/email.worker.js";
import startEmailScheduler from "./src/schedulers/email.scheduler.js";
import gracefulApiShutdown from "./src/utils/gracefulApiShutdown.js";
import "./src/events/email.events.js";

let server;

const startServer = async () => {
  try {
    // 1. Connect to Redis (verify connection)
    if (redis.status !== "ready" && redis.status !== "connect") {
      await redis.ping();
    }

    // 2. Initialize BullMQ Queue & Scheduler
    await emailQueue.waitUntilReady();
    await startEmailScheduler();

    // 3. Ensure BullMQ Worker is ready (worker initialized via module import)
    await emailWorker.waitUntilReady();

    // 4. Start Express Server
    server = app.listen(config.server.port, () => {
      logger.info(`[SERVER] Server started on port ${config.server.port}`);
    });
  } catch (error) {
    logger.error(`[SERVER] Unable to start application: ${error.message}`);
    process.exit(1);
  }
};

const shutdown = () =>
  gracefulApiShutdown(server, {
    worker: emailWorker,
    waitForBackgroundWork: waitForPendingDLQTransfers,
  });

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

await startServer();
