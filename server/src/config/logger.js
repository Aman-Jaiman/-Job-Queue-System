import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

const developmentFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }),
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  silent: process.env.NODE_ENV === "test",

  // JSON lets Railway and other log platforms index fields such as
  // requestId. Local development keeps a compact human-readable format.
  format: isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      )
    : developmentFormat,

  transports: [new winston.transports.Console()],
});

export default logger;
