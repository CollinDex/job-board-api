import { Request, Response, NextFunction } from "express";
import { JobService } from "../services";
import { sendJsonResponse } from "../utils/send-response";
import mongoose, { Types } from "mongoose";
import { IJob, UserRole } from "../types";
import { Unauthorized } from "../middleware";

const jobService = new JobService();

const createJob = async (req: Request, res: Response, next: NextFunction ) => {
    try {

        if (req.user.role != UserRole.EMPLOYER) {
            throw new Unauthorized("Only Employers can create a Job");
        };

        const payload = req.body as IJob;
        const employer_id = new mongoose.Types.ObjectId(req.user.user_id);
        payload.employer_id = employer_id;

        const { message, job } = await jobService.createJob(payload);
        
        sendJsonResponse(res, 201, message, {job});
    } catch (error) {
        next(error);
    }
};

const getCreatedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (req.user.role != UserRole.EMPLOYER) {
            throw new Unauthorized("Only Employers can fetch a job they created");
        };

        const user_id = new mongoose.Types.ObjectId(req.user.user_id);
        const { message, jobs } = await jobService.getCreatedJobs(user_id);
        sendJsonResponse(res, 200, message, {jobs});
    } catch (error) {
        next(error);
    }
};

const updateJob = async (req: Request, res: Response, next: NextFunction ) => {
    try {

        if (req.user.role != UserRole.EMPLOYER) {
            throw new Unauthorized("Only Employers can update a Job");
        };

        const job_id = req.body.job_id as Types.ObjectId;
        const payload = req.body as IJob;
        const employer_id = new mongoose.Types.ObjectId(req.user.user_id);
        payload.employer_id = employer_id;

        const { message, job } = await jobService.updateJob(payload, job_id );
        
        sendJsonResponse(res, 200, message, {job})
    } catch (error) {
        next(error);
    }
};

const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (req.user.role != UserRole.EMPLOYER) {
            throw new Unauthorized("Only Employers can delete a job they created");
        };

        const user_id = new mongoose.Types.ObjectId(req.user.user_id);
        const job_id = req.body.job_id as Types.ObjectId;

        const { message } = await jobService.deleteJob(job_id, user_id);
        sendJsonResponse(res, 204, message );
    } catch (error) {
        next(error);
    }
};

export { createJob, getCreatedJobs, updateJob, deleteJob };