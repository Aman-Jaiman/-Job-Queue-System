import { Worker } from "bullmq";
import bullMQConfig from "../config/bullmq.js";
import logger from "../config/logger.js";
import sendEmail from "../services/mail/email.service.js";
import { moveToDLQ } from "../services/dlq/dlq.service.js";

const pendingDLQTransfers = new Set();

logger.info("[WORKER] Worker started");

const emailWorker = new Worker(
  "email",

  async (job) => {
    logger.info(`[WORKER] Processing job ${job.id}`);

    // Scheduled daily report job
    if (job.name === "daily-report") {
      logger.info("Generating Daily Report...");

      return {
        type: "daily-report",
        status: "generated",
      };
    }

    // Email job
    await sendEmail({
      to: job.data.to,
      subject: job.data.subject,
      text: job.data.text,
      html: job.data.html,
    });

    return {
      type: "email",
      status: "sent",
    };
  },

  bullMQConfig,
);

// ----------------------------------------
// Worker Events
// ----------------------------------------

emailWorker.on("completed", (job) => {
  logger.info(`[WORKER] Job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  if (!job) {
    logger.error(`[WORKER] Worker job failed: ${error.message}`);
    return;
  }

  logger.error(`[WORKER] Job ${job.id} failed: ${error.message}`);
  logger.error(`Attempt ${job.attemptsMade}/${job.opts.attempts}`);

  /*
   * Move job to DLQ only after
   * all retry attempts are exhausted.
   */
  const maxAttempts = job.opts.attempts || 1;

  if (job.attemptsMade >= maxAttempts) {
    const transfer = moveToDLQ(job, error.message)
      .then(() => {
        logger.warn(`Job ${job.id} recorded in DLQ after final attempt`);
      })
      .catch((dlqError) => {
        logger.error(
          `Failed to record Job ${job.id} in DLQ: ${dlqError.message}`,
        );
      })
      .finally(() => {
        pendingDLQTransfers.delete(transfer);
      });

    pendingDLQTransfers.add(transfer);
  }
});

emailWorker.on("error", (error) => {
  logger.error(`Worker error: ${error.message}`);
});

emailWorker.on("stalled", (jobId) => {
  logger.warn(`Job ${jobId} has stalled`);
});

export default emailWorker;

export const waitForPendingDLQTransfers = async () => {
  await Promise.all([...pendingDLQTransfers]);
};
