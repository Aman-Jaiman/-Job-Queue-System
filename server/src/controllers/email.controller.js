import emailQueue from "../queues/email.queue.js";
import logger from "../config/logger.js";

export const addEmailJob = async (req, res, next) => {
  try {
    const { to, subject, text, html } = req.body;

    const job = await emailQueue.add(
      "send-email",
      {
        to,
        subject,
        text,
        html,

        // Correlation ID
        requestId: req.requestId,
      },
      // Retry/retention defaults live in bullmq.js, keeping jobs added
      // from the API and from schedulers on the same lifecycle policy.
      {},
    );

    logger.info(`Email job created: ${job.id} | requestId=${req.requestId}`);

    return res.status(202).json({
      success: true,
      message: "Email job added successfully",
      jobId: job.id,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
};
