import {
    getJobById,
    getJobStateService,
    deleteJobService,
    retryJobService,
    getAllJobsService,
} from "../services/jobs/jobs.service.js";

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

        const jobs = await getAllJobsService();

        return res.status(200).json({
            success: true,
            total: jobs.length,
            jobs,
        });

    } catch (error) {
        next(error);
    }
};