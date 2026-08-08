import app from "./src/app.js";
import config from "./src/config/env.js";
import logger from "./src/config/logger.js";
import startEmailScheduler from "./src/schedulers/email.scheduler.js";
import "./src/events/email.events.js";

const startServer = async () => {
    try {
        await startEmailScheduler();

        app.listen(config.server.port, () => {
            logger.info(`Server running on port ${config.server.port}`);
        });
    } catch (error) {
        logger.error(error.message);
        process.exit(1);
    }
};

startServer();
