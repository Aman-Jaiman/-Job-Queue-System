import { loginService } from "../services/auth/auth.service.js";
import AppError from "../utils/AppError.js";

export const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError(
                "Email and password are required",
                400
            );
        }

        const token = await loginService(
            email,
            password
        );

        if (!token) {
            throw new AppError(
                "Invalid email or password",
                401
            );
        }

        return res.status(200).json({
            success: true,
            token,
        });

    } catch (error) {
        next(error);
    }
};