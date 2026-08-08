import { Queue } from "bullmq";
import bullMQConfig from "../config/bullmq.js";

const dlqQueue = new Queue("dead-letter", bullMQConfig);

export default dlqQueue;