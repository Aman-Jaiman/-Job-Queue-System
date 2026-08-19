import express from "express";
import request from "supertest";
import redis from "../src/config/redis.js";
import config from "../src/config/env.js";
import createRateLimiter from "../src/middleware/rateLimit.js";

const app = express();

app.use((req, _res, next) => {
  if (req.headers["x-test-user"]) {
    req.user = { email: req.headers["x-test-user"] };
  }

  next();
});

app.get(
  "/limited",
  createRateLimiter({
    windowSeconds: 60,
    maxRequests: 2,
    keyPrefix: "rate-test",
  }),
  (_req, res) => res.status(200).json({ success: true }),
);

const resetRateLimits = async () => {
  const keys = await redis.keys(`${config.rateLimit.prefix}:rate-test:*`);

  if (keys.length) {
    await redis.del(...keys);
  }
};

describe("Redis rate limiting", () => {
  beforeEach(resetRateLimits);

  test("allows requests through the limit and rejects the next request", async () => {
    const first = await request(app).get("/limited");
    const second = await request(app).get("/limited");
    const third = await request(app).get("/limited");

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
    expect(second.headers["x-ratelimit-remaining"]).toBe("0");
    expect(third.statusCode).toBe(429);
    expect(third.headers["retry-after"]).toBeDefined();
  });

  test("sets a TTL when it creates a rate-limit key", async () => {
    await request(app).get("/limited");

    const keys = await redis.keys(`${config.rateLimit.prefix}:rate-test:*`);

    expect(keys).toHaveLength(1);
    expect(await redis.ttl(keys[0])).toBeGreaterThan(0);
  });

  test("uses a separate hashed key for an authenticated identity", async () => {
    await request(app).get("/limited").set("X-Test-User", "first@example.com");
    const secondForFirstUser = await request(app)
      .get("/limited")
      .set("X-Test-User", "first@example.com");
    const firstForSecondUser = await request(app)
      .get("/limited")
      .set("X-Test-User", "second@example.com");

    const keys = await redis.keys(`${config.rateLimit.prefix}:rate-test:*`);

    expect(secondForFirstUser.headers["x-ratelimit-remaining"]).toBe("0");
    expect(firstForSecondUser.headers["x-ratelimit-remaining"]).toBe("1");
    expect(keys).toHaveLength(2);
    expect(keys.join(" ")).not.toContain("@example.com");
  });
});
