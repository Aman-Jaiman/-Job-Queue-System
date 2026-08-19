import { Worker } from "bullmq";
import bullMQConfig from "../config/bullmq.js";
import logger from "../config/logger.js";
import sendEmail from "../services/mail/email.service.js";
import { moveToDLQ } from "../services/dlq/dlq.service.js";

const pendingDLQTransfers = new Set();

const emailWorker = new Worker(
  "email",

  async (job) => {
    logger.info(`Processing Job ${job.id} (${job.name})`);

    // Scheduled daily report job
    if (job.name === "daily-report") {
      logger.info("Generating Daily Report...");

      // Your actual report generation logic can go here.

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

    logger.info(`Email job ${job.id} sent successfully`);

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

emailWorker.on("completed", (job, result) => {
  logger.info(`Job ${job.id} completed successfully`);

  logger.info(`Job ${job.id} completed with status ${result.status}`);
});

emailWorker.on("failed", (job, error) => {
  if (!job) {
    logger.error(`Worker job failed: ${error.message}`);
    return;
  }

  logger.error(`Job ${job.id} failed: ${error.message}`);

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
