import redis from "../config/redis.js";
import emailQueue from "../queues/email.queue.js";

export const healthCheck = async (_req, res) => {
  let redisHealthy = false;
  let queueHealthy = false;

  try {
    await redis.ping();
    redisHealthy = true;
    await emailQueue.getJobCounts("waiting");
    queueHealthy = true;
  } catch {}

  const isHealthy = redisHealthy && queueHealthy;

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "unhealthy",
    service: "job-queue-system",
    timestamp: new Date().toISOString(),
    success: isHealthy,
    uptime: process.uptime(),
    services: {
      redis: redisHealthy ? redis.status : "disconnected",
      queue: queueHealthy ? "connected" : "disconnected",
    },
  });
};
