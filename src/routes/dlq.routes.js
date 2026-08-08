import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { getDLQ ,
     getDLQStatistics,
     getDLQJobById,
     retryDLQ,
     deleteDLQ  } from "../controllers/dlq.controller.js";

const router = Router();


/* Protect all DLQ routes */
router.use(
    authenticate,
    authorize("admin")
);

/**
 * @swagger
 * /api/dlq:
 *   get:
 *     summary: Get all failed jobs from the Dead Letter Queue
 *     tags:
 *       - DLQ
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of failed jobs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin access required)
 */

router.get("/", getDLQ);

router.get("/stats", getDLQStatistics);

router.get("/:id", getDLQJobById);

router.post("/:id/retry", retryDLQ);

router.delete("/:id", deleteDLQ);

export default router;