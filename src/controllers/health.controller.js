import redis from "../config/redis.js";
import emailQueue from "../queues/email.queue.js";

export const healthCheck = async (req, res, next) => {
  try {
    const redisStatus = redis.status;

    let queueStatus = "connected";

    try {
      await emailQueue.getJobCounts();
    } catch {
      queueStatus = "disconnected";
    }

    const healthy = redisStatus === "ready" && queueStatus === "connected";

    return res.status(healthy ? 200 : 503).json({
      success: healthy,
      status: healthy ? "healthy" : "unhealthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        redis: redisStatus,
        queue: queueStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
