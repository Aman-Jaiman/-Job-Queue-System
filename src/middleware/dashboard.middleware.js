import authenticate from "./auth.middleware.js";
import authorize from "./role.middleware.js";

const dashboardMiddleware = [
    authenticate,
    authorize("admin"),
];

export default dashboardMiddleware;