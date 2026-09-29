import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { apiRateLimit } from "../middleware/rateLimits.js";
import {
  getJob,
  getJobState,
  deleteJob,
  retryJob,
  getAllJobs,
} from "../controllers/jobs.controller.js";

const router = Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all jobs
 */

router.get("/", authenticate, apiRateLimit, authorize("admin"), getAllJobs);

router.get("/:id", authenticate, apiRateLimit, authorize("admin"), getJob);

router.get(
  "/:id/state",
  authenticate,
  apiRateLimit,
  authorize("admin"),
  getJobState,
);

router.delete(
  "/:id",
  authenticate,
  apiRateLimit,
  authorize("admin"),
  deleteJob,
);

router.post(
  "/:id/retry",
  authenticate,
  apiRateLimit,
  authorize("admin"),
  retryJob,
);

export default router;
