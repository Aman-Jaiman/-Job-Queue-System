import dotenv from "dotenv";

dotenv.config();

const requiredString = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const optionalString = (name) => process.env[name]?.trim() || undefined;

const port = (name, fallback) => {
  const value = process.env[name] ?? fallback;
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`${name} must be a valid TCP port`);
  }

  return parsed;
};

const positiveInteger = (name, fallback) => {
  const value = process.env[name] ?? fallback;
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
};

const boolean = (name, fallback = false) => {
  const value = process.env[name];

  if (value === undefined) {
    return fallback;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`${name} must be either true or false`);
};

const environment = process.env.NODE_ENV || "development";
const jwtSecret = requiredString("JWT_SECRET");

// A short signing key makes token forgery materially easier in production.
if (environment === "production" && jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

const mailUser = requiredString("MAIL_USER");

const config = {
  environment,

  server: {
    port: port("PORT", 3000),
  },

  redis: {
    host: requiredString("REDIS_HOST"),
    port: port("REDIS_PORT", 6379),
    password: optionalString("REDIS_PASSWORD"),
  },

  bullmq: {
    prefix: optionalString("BULLMQ_PREFIX") || "job-queue",
  },

  jwt: {
    secret: jwtSecret,
    expiresIn: optionalString("JWT_EXPIRES_IN") || "1h",
  },

  admin: {
    email: requiredString("ADMIN_EMAIL").toLowerCase(),
    passwordHash: requiredString("ADMIN_PASSWORD"),
  },

  mail: {
    host: requiredString("MAIL_HOST"),
    port: port("MAIL_PORT", 587),
    secure: boolean("MAIL_SECURE"),
    user: mailUser,
    pass: requiredString("MAIL_PASS"),
    from: optionalString("MAIL_FROM") || mailUser,
  },

  cors: {
    origins: (optionalString("CORS_ORIGINS") || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  },

  scheduler: {
    reportSchedule: optionalString("REPORT_SCHEDULE") || "0 9 * * *",
    timezone: optionalString("REPORT_TIMEZONE"),
  },

  rateLimit: {
    prefix: optionalString("RATE_LIMIT_KEY_PREFIX") || "rate-limit",
  },

  shutdown: {
    timeoutMs: positiveInteger("SHUTDOWN_TIMEOUT_MS", 30000),
  },

  features: {
    apiDocs: boolean("ENABLE_API_DOCS", environment !== "production"),
    bullBoard: boolean("ENABLE_BULL_BOARD", environment !== "production"),
  },
};

export default config;
