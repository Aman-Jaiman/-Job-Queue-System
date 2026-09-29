import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { apiRateLimit } from "../middleware/rateLimits.js";
import { getMonitor } from "../controllers/monitor.controller.js";

const router = Router();

/**
 * @swagger
 * /api/monitor:
 *   get:
 *     summary: Get queue, worker, and Redis monitoring information
 *     tags:
 *       - Monitoring
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monitoring information retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin access required)
 *       500:
 *         description: Internal server error
 */

/* Protect all DLQ routes */
router.use(authenticate, apiRateLimit, authorize("admin"));

router.get("/", getMonitor);

export default router;
