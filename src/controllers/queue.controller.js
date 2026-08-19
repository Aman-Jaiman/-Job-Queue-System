import emailQueue from "../queues/email.queue.js";

export const pauseQueue = async (req, res, next) => {
  try {
    await emailQueue.pause();

    return res.status(200).json({
      success: true,
      message: "Queue paused successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resumeQueue = async (req, res, next) => {
  try {
    await emailQueue.resume();

    return res.status(200).json({
      success: true,
      message: "Queue resumed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const emptyQueue = async (req, res, next) => {
  try {
    await emailQueue.drain();

    return res.status(200).json({
      success: true,
      message: "Waiting and delayed jobs emptied successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const queueStats = async (req, res, next) => {
  try {
    const counts = await emailQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
      "paused",
    );

    return res.status(200).json({
      success: true,
      stats: counts,
    });
  } catch (error) {
    next(error);
  }
};
