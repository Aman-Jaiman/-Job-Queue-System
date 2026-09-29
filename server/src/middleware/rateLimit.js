import redis from "../config/redis.js";
import crypto from "crypto";
import config from "../config/env.js";
import AppError from "../utils/AppError.js";

const incrementWithExpiry = `
    local current = redis.call("INCR", KEYS[1])
    if current == 1 then
        redis.call("EXPIRE", KEYS[1], ARGV[1])
    end
    return { current, redis.call("TTL", KEYS[1]) }
`;

const createRateLimiter = ({
  windowSeconds,
  maxRequests,
  keyPrefix,
  message = "Too many requests. Please try again later.",
}) => {
  return async (req, res, next) => {
    try {
      // Prefer authenticated user identity.
      // Fall back to IP for unauthenticated requests.
      const identifier = String(
        req.user?.email || req.ip || req.socket.remoteAddress || "unknown",
      );

      // Hash the identifier so Redis keys do not store raw email or IP
      // addresses while preserving a stable per-client rate-limit key.
      const identifierHash = crypto
        .createHash("sha256")
        .update(identifier)
        .digest("hex");

      const key = `${config.rateLimit.prefix}:${keyPrefix}:${identifierHash}`;

      // A Lua script makes INCR and initial expiry one Redis operation.
      // Without this, a process crash between calls could leave a
      // permanent rate-limit key with no TTL.
      const [current, ttl] = await redis.eval(
        incrementWithExpiry,
        1,
        key,
        windowSeconds,
      );

      // Useful headers for clients.
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, maxRequests - current),
      );
      res.setHeader("X-RateLimit-Reset", Math.max(0, ttl));

      if (current > maxRequests) {
        res.setHeader("Retry-After", Math.max(1, ttl));

        throw new AppError(message, 429);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }

      // Failing open would make brute-force protection disappear during
      // a Redis outage. The queue also depends on Redis, so fail closed.
      next(new AppError("Rate limiting service unavailable", 503));
    }
  };
};

export default createRateLimiter;
