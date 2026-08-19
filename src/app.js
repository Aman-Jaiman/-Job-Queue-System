import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import config from "./config/env.js";

/* ----------------------------------------
 * Dashboard
 * ---------------------------------------- */

import bullBoard from "./dashboard/bullBoard.js";
import { swaggerUi, specs } from "./docs/swagger.js";

/* ----------------------------------------
 * Routes
 * ---------------------------------------- */

import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import dlqRoutes from "./routes/dlq.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import monitorRoutes from "./routes/monitor.routes.js";
import healthRoutes from "./routes/health.routes.js";

/* ----------------------------------------
 * Middleware
 * ---------------------------------------- */

import dashboardMiddleware from "./middleware/dashboard.middleware.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import requestId from "./middleware/requestId.middleware.js";

const app = express();

/* ========================================
 * TRUST PROXY
 * ======================================== */

// Required when running behind a reverse proxy
// such as Nginx, Render, Railway, AWS ALB, etc.

if (config.environment === "production") {
  app.set("trust proxy", 1);
}

/* ========================================
 * SECURITY
 * ======================================== */

app.use(helmet());
app.use(compression());

/* ========================================
 * CORS
 * ======================================== */

app.use(
  cors(
    config.environment === "production"
      ? {
          // Same-origin and non-browser callers have no Origin header.
          // Browser origins must be deliberately allow-listed in prod.
          origin: (origin, callback) => {
            callback(null, !origin || config.cors.origins.includes(origin));
          },
          credentials: false,
        }
      : {
          origin: true,
          credentials: false,
        },
  ),
);

/* ========================================
 * REQUEST ID
 * ======================================== */

// Give every request a unique ID.
// This is useful for logs and debugging.

app.use(requestId);

/* ========================================
 * BODY PARSER
 * ======================================== */

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

/* ========================================
 * SWAGGER API DOCUMENTATION
 * ======================================== */

if (config.features.apiDocs) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

/* ========================================
 * BULL BOARD DASHBOARD
 * ======================================== */

// Protected through dashboardMiddleware.
// Dashboard is available at:
//
// /admin/queues

if (config.features.bullBoard) {
  app.use("/admin/queues", dashboardMiddleware, bullBoard.getRouter());
}

/* ========================================
 * HEALTH CHECK
 * ======================================== */

app.use("/health", healthRoutes);

/* ========================================
 * API ROUTES
 * ======================================== */

app.use("/api/auth", authRoutes);

app.use("/api/email", emailRoutes);

app.use("/api/jobs", jobsRoutes);

app.use("/api/queue", queueRoutes);

app.use("/api/dlq", dlqRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/monitor", monitorRoutes);

/* ========================================
 * ROOT ROUTE
 * ======================================== */

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Job Queue System API Running",
  });
});

/* ========================================
 * 404 HANDLER
 * ======================================== */

// MUST be after all routes.

app.use(notFound);

/* ========================================
 * GLOBAL ERROR HANDLER
 * ======================================== */

// MUST be the final middleware.

app.use(errorHandler);

export default app;
