import emailQueue from "../queues/email.queue.js";

async function startEmailScheduler() {

    await emailQueue.upsertJobScheduler(
        "daily-report",
        {
            pattern: "*/1 * * * *"
        },
        {
            name: "daily-report",
            data: {
                type: "report"
            }
        }
    );

    console.log("Email Scheduler Started");
}

export default startEmailScheduler;



// | Pattern       | Meaning           |
// | ------------- | ----------------- |
// | `*/1 * * * *` | Every minute      |
// | `*/5 * * * *` | Every 5 minutes   |
// | `0 * * * *`   | Every hour        |
// | `0 9 * * *`   | Every day at 9 AM |
// | `0 0 * * 0`   | Every Sunday      |
