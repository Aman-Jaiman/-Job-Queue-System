import redis from "./redis.js";

const bullMQConfig = {
    connection: redis,

    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 500,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
    },
};

export default bullMQConfig;