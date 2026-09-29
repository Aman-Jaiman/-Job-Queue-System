import redis from "../src/config/redis.js";
import config from "../src/config/env.js";
import emailQueue from "../src/queues/email.queue.js";
import dlqQueue from "../src/queues/dlq.queue.js";

beforeAll(async () => {
  await redis.ping();

  const keys = await redis.keys(`${config.rateLimit.prefix}:*`);

  if (keys.length > 0) {
    await redis.del(...keys);
  }

  await Promise.all([
    emailQueue.obliterate({ force: true }),
    dlqQueue.obliterate({ force: true }),
  ]);
});

afterAll(async () => {
  await Promise.all([emailQueue.close(), dlqQueue.close(), redis.quit()]);
});
