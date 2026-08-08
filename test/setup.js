import redis from "../src/config/redis.js";

afterAll(async () => {
    await redis.quit();
});