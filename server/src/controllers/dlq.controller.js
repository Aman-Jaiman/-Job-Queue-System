import {
  getDLQJobs,
  getDLQJob,
  retryDLQJob,
  deleteDLQJob,
  getDLQStats,
} from "../services/dlq/dlq.service.js";

import AppError from "../utils/AppError.js";

const getLimit = (value) => {
  const limit = Number(value ?? 50);

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("limit must be an integer between 1 and 100", 400);
  }

  return limit;
};

export const getDLQ = async (req, res, next) => {
  try {
    const limit = getLimit(req.query.limit);
    const jobs = await getDLQJobs(limit);

    const result = jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
    }));

    return res.status(200).json({
      success: true,
      total: result.length,
      limit,
      jobs: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDLQJobById = async (req, res, next) => {
  try {
    const job = await getDLQJob(req.params.id);

    if (!job) {
      throw new AppError("DLQ Job not found", 404);
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

export const retryDLQ = async (req, res, next) => {
  try {
    const success = await retryDLQJob(req.params.id);

    if (!success) {
      throw new AppError("DLQ Job not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "DLQ Job retried successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDLQ = async (req, res, next) => {
  try {
    const success = await deleteDLQJob(req.params.id);

    if (!success) {
      throw new AppError("DLQ Job not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "DLQ Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getDLQStatistics = async (req, res, next) => {
  try {
    const stats = await getDLQStats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
