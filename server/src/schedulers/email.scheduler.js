import emailQueue from "../queues/email.queue.js";
import config from "../config/env.js";
import logger from "../config/logger.js";

async function startEmailScheduler() {
  const repeatOptions = {
    pattern: config.scheduler.reportSchedule,
  };

  if (config.scheduler.timezone) {
    repeatOptions.tz = config.scheduler.timezone;
  }

  await emailQueue.upsertJobScheduler("daily-report", repeatOptions, {
    name: "daily-report",
    data: {
      type: "report",
    },
  });

  logger.info(
    `Daily report scheduler configured: ${config.scheduler.reportSchedule}`,
  );
}

export default startEmailScheduler;
