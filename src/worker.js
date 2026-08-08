import logger from "./config/logger.js";
import emailWorker from "./workers/email.worker.js";
import gracefulShutdown from "./utils/gracefulShutdown.js";

logger.info("Worker process started...");

process.on("SIGINT", () => gracefulShutdown(emailWorker));
process.on("SIGTERM", () => gracefulShutdown(emailWorker));