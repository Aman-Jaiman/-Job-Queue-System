import logger from "../config/logger.js";

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  logger.error(err.stack || err.message, {
    requestId: req.requestId,
  });

  res.status(statusCode).json({
    success: false,

    message:
      statusCode < 500 || !isProduction
        ? err.message || "Internal Server Error"
        : "Internal Server Error",

    requestId: req.requestId,
  });
};

export default errorHandler;
