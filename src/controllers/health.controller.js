import redis from "../config/redis.js";

export const healthCheck = async (req, res, next) => {
  try {
    const redisStatus = redis.status;
    const isHealthy = redisStatus === "ready" || redisStatus === "connect";

    return res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? "ok" : "unhealthy",
      service: "job-queue-system",
      timestamp: new Date().toISOString(),
      success: isHealthy,
      uptime: process.uptime(),
      services: {
        redis: redisStatus,
        queue: isHealthy ? "connected" : "disconnected",
      },
    });
  } catch (error) {
    next(error);
  }
};
