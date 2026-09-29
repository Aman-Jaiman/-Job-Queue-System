import { Queue } from "bullmq";
import bullMQConfig from "../config/bullmq.js";

const emailQueue = new Queue("email", bullMQConfig);

export default emailQueue;
