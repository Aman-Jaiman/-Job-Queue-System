import app from "./src/app.js";
import config from "./src/config/env.js";
import logger from "./src/config/logger.js";
import startEmailScheduler from "./src/schedulers/email.scheduler.js";
import gracefulApiShutdown from "./src/utils/gracefulApiShutdown.js";
import "./src/events/email.events.js";

let server;

const startServer = async () => {
  try {
    await startEmailScheduler();

    server = app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`);
    });
  } catch (error) {
    logger.error(`Unable to start API: ${error.message}`);
    process.exit(1);
  }
};

const shutdown = () => gracefulApiShutdown(server);

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

await startServer();
