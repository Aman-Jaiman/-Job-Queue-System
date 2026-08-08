import dotenv from "dotenv";
import { mongo } from "mongoose";


//Loaded dotenv
const result = dotenv.config();


// 1. Define required environment variables
const requiredEnvVars = [
    "PORT",
    "HOSTNAME",
    "REDIS_HOST",
    "REDIS_PORT",
    // I am using local Redis so no need of this
    // "REDIS_PASSWORD"
];

//Fail Fast Validation
// 2. Validate each one (Fail Fast)
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}


// 3. Build the config object
const config = {
    server: {
        //Type Conversion because Environment variables are strings.
        port: Number(process.env.PORT),

        hostname: process.env.HOSTNAME,
    },

    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),

        // Local Redis often has no password.
        // Cloud Redis usually does.
        password: process.env.REDIS_PASSWORD || undefined,
    },


    mongodb: {
        uri: process.env.MONGODB_URI,
    },


    bullmq: {
        prefix: process.env.BULLMQ_PREFIX || "job-queue",
    },


    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },

    mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
},

jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
},

};



// Export it
export default config;