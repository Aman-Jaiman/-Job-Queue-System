//We import the Redis client library.
import Redis from "ioredis";

import config from "./env.js";
import logger from "./logger.js";

// This client is reserved for lightweight API infrastructure work such as
// health checks and rate limiting. BullMQ components own separate connections
// so closing one API resource cannot interrupt another component's commands.
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  // API requests must fail promptly when Redis is unavailable rather than
  // waiting behind an indefinitely retried command.
  maxRetriesPerRequest: 1,
  enableReadyCheck: true,
  connectTimeout: 5000,
  retryStrategy: (attempt) => Math.min(attempt * 200, 2000),
});

redis.on("connect", () => {
  logger.info("Redis TCP connection established");
});

redis.on("ready", () => {
  logger.info("Redis is ready");
});

redis.on("error", (err) => {
  logger.error(`Redis Error: ${err.message}`);
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

redis.on("reconnecting", () => {
  logger.warn("Reconnecting to Redis...");
});

export default redis;
