import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { apiRateLimit } from "../middleware/rateLimits.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get queue analytics
 *     description: Returns analytics and metrics for the email queue.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin access required)
 *       500:
 *         description: Internal server error
 */

/* Protect all DLQ routes */
router.use(authenticate, apiRateLimit, authorize("admin"));

router.get("/", getAnalytics);

export default router;
