import { Router } from "express";
import { addEmailJob } from "../controllers/email.controller.js";
import validate from "../middleware/validate.js";
import emailSchema from "../validators/email.validator.js";

const router = Router();

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Add an email job to the queue
 *     tags:
 *       - Email
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - text
 *             properties:
 *               to:
 *                 type: string
 *                 example: test@example.com
 *               subject:
 *                 type: string
 *                 example: Welcome
 *               text:
 *                 type: string
 *                 example: Hello from BullMQ
 *               html:
 *                 type: string
 *                 example: "<h1>Hello</h1>"
 *     responses:
 *       202:
 *         description: Email job added successfully
 */
router.post(
    "/",
    validate(emailSchema),
    addEmailJob
);

export default router;