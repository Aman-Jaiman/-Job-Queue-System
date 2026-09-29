import {
  getJobById,
  getJobStateService,
  deleteJobService,
  retryJobService,
  getAllJobsService,
} from "../services/jobs/jobs.service.js";
import AppError from "../utils/AppError.js";

const getLimit = (value) => {
  const limit = Number(value ?? 50);

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("limit must be an integer between 1 and 100", 400);
  }

  return limit;
};

export const getJob = async (req, res, next) => {
  try {
    const job = await getJobById(req.params.id);

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobState = async (req, res, next) => {
  try {
    const state = await getJobStateService(req.params.id);

    return res.status(200).json({
      success: true,
      state,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    await deleteJobService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const retryJob = async (req, res, next) => {
  try {
    await retryJobService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job retried successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const limit = getLimit(req.query.limit);
    const jobs = await getAllJobsService(limit);

    return res.status(200).json({
      success: true,
      total: jobs.length,
      limit,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
