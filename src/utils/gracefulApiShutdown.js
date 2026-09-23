import config from "../config/env.js";
import logger from "../config/logger.js";
import redis from "../config/redis.js";
import emailQueue from "../queues/email.queue.js";
import dlqQueue from "../queues/dlq.queue.js";
import emailQueueEvents from "../events/email.events.js";

let shutdownPromise;

const closeServer = (server) =>
  new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error && error.code !== "ERR_SERVER_NOT_RUNNING") {
        reject(error);
        return;
      }

      resolve();
    });

    // Existing keep-alive connections should not keep the process alive
    // after the configured shutdown deadline.
    server.closeIdleConnections?.();
  });

const gracefulApiShutdown = (
  server,
  {
    worker,
    waitForBackgroundWork = async () => {},
    queues = [emailQueue, dlqQueue, emailQueueEvents],
    redisClient = redis,
    exit = process.exit,
    timeoutMs = config.shutdown.timeoutMs,
  } = {},
) => {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  shutdownPromise = (async () => {
    const timeout = setTimeout(() => {
      logger.error("API graceful shutdown timed out; forcing exit");
      exit(1);
    }, timeoutMs);

    try {
      logger.info("API graceful shutdown started");
      await closeServer(server);

      if (worker && typeof worker.close === "function") {
        await worker.close();
      }

      await waitForBackgroundWork();
      await Promise.all(queues.map((queue) => queue.close()));

      if (redisClient.status !== "end") {
        await redisClient.quit();
      }

      logger.info("API graceful shutdown completed");
      exit(0);
    } catch (error) {
      logger.error(`API shutdown error: ${error.message}`);
      exit(1);
    } finally {
      clearTimeout(timeout);
    }
  })();

  return shutdownPromise;
};

export default gracefulApiShutdown;
