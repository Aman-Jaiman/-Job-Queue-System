import os from "os";

const startedAt = Date.now();

export const getWorkerMetrics = () => {

    const uptime = Math.floor(process.uptime());

    return {
        pid: process.pid,

        uptime,

        memory: process.memoryUsage(),

        cpuCount: os.cpus().length,

        platform: process.platform,

        nodeVersion: process.version,

        hostname: os.hostname(),

        startedAt,
    };

};