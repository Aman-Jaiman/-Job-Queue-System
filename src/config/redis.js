//We import the Redis client library.
import Redis from "ioredis";

import config from "./env.js";

import logger from "./logger.js";

console.log(config.redis);


// This creates one Redis client instance
const redis = new Redis({
    host: config.redis.host,

    port: config.redis.port,

    // Passing undefined simply means "don't authenticate with a password."
    password: config.redis.password || undefined,

    // BullMQ recommends setting it to null so requests aren't automatically failed due to retry limits. It allows BullMQ to manage long-lived operations correctly.
    maxRetriesPerRequest: null,

    //Redis may be connected at the TCP level but not yet fully ready.
    // The ready check waits until Redis can actually serve commands.
    enableReadyCheck: true,
});


//The TCP connection to Redis has been established.
redis.on("connect", () => {
    logger.info("Redis TCP connection established");
});


//Redis is fully initialized and ready to accept commands
redis.on("ready", () => {
    logger.info("Redis is ready");
});


//Handles situations like: Wrong password, Redis server down, Network failure, DNS issues
//Instead of crashing silently, we log the error.
redis.on("error", (err) => {
    logger.error(`Redis Error: ${err.message}`);
});


//Triggered when the connection closes.
//Possible reasons:Redis stopped, Network interruption, Application shutdown
redis.on("close", () => {
    logger.warn("Redis connection closed");
});


//ioredis automatically tries to reconnect.
redis.on("reconnecting", () => {
    logger.warn("Reconnecting to Redis...");
});


export default redis;