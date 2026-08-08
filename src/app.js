import express from "express";

/* Dashboard */
import bullBoard from "./dashboard/bullBoard.js";
import { swaggerUi, specs } from "./docs/swagger.js";

/* Routes */
import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import dlqRoutes from "./routes/dlq.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import monitorRoutes from "./routes/monitor.routes.js";

/* Middleware */
import dashboardMiddleware from "./middleware/dashboard.middleware.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";


const app = express();

app.use(express.json());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

/* Bull Board Dashboard */
app.use(
    "/admin/queues",
    dashboardMiddleware,
    bullBoard.getRouter()
);

/* Routes */
app.use("/api/email", emailRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use("/api/jobs", jobsRoutes);


app.use("/api/queue", queueRoutes);

app.use("/api/dlq", dlqRoutes);

app.use("/api/monitor", monitorRoutes);

app.use("/api/auth", authRoutes);

/* Health Check */
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Job Queue System API Running",
    });
});

/* 404 Middleware (ALWAYS LAST ROUTE) */
app.use(notFound);

/* Global Error Handler (VERY LAST) */
app.use(errorHandler);

export default app;