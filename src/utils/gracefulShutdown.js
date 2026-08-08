import logger from "../config/logger.js";

const gracefulShutdown = async (worker) => {
    try {
        logger.info("Graceful shutdown started...");

        await worker.close();

        logger.info("Worker closed successfully.");

        process.exit(0);

    } catch (error) {

        logger.error(error);

        process.exit(1);

    }
};

export default gracefulShutdown;