import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin Login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login Successful
 *       401:
 *         description: Invalid Credentials
 */

router.post("/login", login);

export default router;