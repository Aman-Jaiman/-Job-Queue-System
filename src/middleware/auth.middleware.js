import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";

const authenticate = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError("Access token missing", 401);
        }

        if (!authHeader.startsWith("Bearer ")) {
            throw new AppError("Invalid authorization format", 401);
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        req.user = decoded;

        next();

    } catch (error) {

        next(
            new AppError(
                "Invalid or expired token",
                401
            )
        );

    }
};

export default authenticate;