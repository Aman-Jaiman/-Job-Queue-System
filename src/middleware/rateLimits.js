import createRateLimiter from "./rateLimit.js";

/*
 * Login
 *
 * Strict because this endpoint can be attacked
 * with brute-force password attempts.
 */
export const loginRateLimit = createRateLimiter({
  windowSeconds: 60,
  maxRequests: 5,
  keyPrefix: "login",
  message: "Too many login attempts. Please try again after a minute.",
});

/*
 * Email creation
 *
 * Prevents users from flooding BullMQ with email jobs.
 */
export const emailRateLimit = createRateLimiter({
  windowSeconds: 60,
  maxRequests: 20,
  keyPrefix: "email",
  message: "Too many email jobs. Please try again later.",
});

/*
 * General API
 *
 * Broader protection for normal authenticated APIs.
 */
export const apiRateLimit = createRateLimiter({
  windowSeconds: 60,
  maxRequests: 100,
  keyPrefix: "api",
  message: "Too many requests. Please slow down.",
});
