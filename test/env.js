// This file runs before application modules are imported. It prevents tests
// from touching development queue data even when a developer's .env is loaded.
process.env.NODE_ENV = "test";
process.env.BULLMQ_PREFIX = "job-queue-test";
process.env.RATE_LIMIT_KEY_PREFIX = "rate-limit-test";
process.env.ENABLE_API_DOCS = "false";
process.env.ENABLE_BULL_BOARD = "false";
