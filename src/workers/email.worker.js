import { Worker } from "bullmq";
import bullMQConfig from "../config/bullmq.js";
import logger from "../config/logger.js";
import sendEmail from "../services/mail/email.service.js";

const emailWorker = new Worker(
    "email",
    async (job) => {
        
        
        logger.info(`Processing Job ${job.id} (${job.name})`);

        if (job.name === "daily-report") {
            logger.info("Generating Daily Report...");
            return;
        }

        await sendEmail({
            to: job.data.to,
            subject: job.data.subject,
            text: job.data.text,
            html: job.data.html,
        });

        logger.info(`Email sent successfully to: ${job.data.to}`);
    },
    bullMQConfig
);

export default emailWorker;