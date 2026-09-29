import config from "./env.js";

const connectionOptions = config.redis.url
  ? {
      url: config.redis.url,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      ...(config.redis.tls ? { tls: { rejectUnauthorized: false } } : {}),
    }
  : {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      ...(config.redis.tls ? { tls: { rejectUnauthorized: false } } : {}),
    };

const bullMQConfig = {
  prefix: config.bullmq.prefix,

  // BullMQ owns a connection per Queue/Worker. Workers require unlimited
  // command retries because they use blocking Redis operations.
  connection: connectionOptions,

  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    // Bound retained data so Redis does not grow without limit while
    // leaving a useful operational window for job inspection.
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 86400,
      count: 5000,
    },
  },
};

export default bullMQConfig;
