import config from "../config/env.js";
import logger from "../config/logger.js";

let shutdownPromise;

const closeAll = async (resources) => {
  const results = await Promise.allSettled(
    resources.map((resource) => resource.close()),
  );
  const failure = results.find((result) => result.status === "rejected");

  if (failure) {
    throw failure.reason;
  }
};

const gracefulShutdown = (
  worker,
  {
    queues = [],
    waitForBackgroundWork = async () => {},
    exit = process.exit,
    timeoutMs = config.shutdown.timeoutMs,
  } = {},
) => {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  shutdownPromise = (async () => {
    const timeout = setTimeout(() => {
      logger.error("Worker shutdown timed out; forcing exit");
      exit(1);
    }, timeoutMs);

    try {
      logger.info("Worker graceful shutdown started");

      // Worker.close stops claiming new jobs and waits for its active
      // processor to finish, avoiding a second worker processing it.
      await worker.close();
      await waitForBackgroundWork();
      await closeAll(queues);

      logger.info("Worker graceful shutdown completed");
      exit(0);
    } catch (error) {
      logger.error(`Worker shutdown error: ${error.message}`);
      exit(1);
    } finally {
      clearTimeout(timeout);
    }
  })();

  return shutdownPromise;
};

export default gracefulShutdown;
