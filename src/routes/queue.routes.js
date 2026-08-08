import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { pauseQueue , resumeQueue, emptyQueue, queueStats} from "../controllers/queue.controller.js";

const router = Router();

/**
 * @swagger
 * /api/queue/stats:
 *   get:
 *     summary: Get queue statistics
 *     tags:
 *       - Queue
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue statistics
 */

/* Protect all DLQ routes */
router.use(
    authenticate,
    authorize("admin")
);

router.post("/pause", pauseQueue);

router.post("/resume", resumeQueue);

router.post("/empty", emptyQueue);

router.get("/stats", queueStats);

export default router;