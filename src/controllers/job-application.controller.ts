import { NextFunction, Request, Response } from 'express';
import { JobApplicationService } from '../services';
import { sendJsonResponse } from '../utils/send-response';
import { jobApplicationSchema } from '../validation-schema/job-application.schema';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { deleteFile } from '../middleware/uploadfile';
import { BadRequest, Unauthorized } from '../middleware';
import { UserRole } from '../types';

const jobApplicationService = new JobApplicationService();

const applyForJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = jobApplicationSchema.parse(req.body);
    const { job_id, cover_letter, use_existing_resume } = validatedData;
    const { user_id } = req.user;
	
    const jobObjectId = new mongoose.Types.ObjectId(job_id);
    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const filePath = use_existing_resume ? null : req.file?.path;
    const filename = use_existing_resume ? null : req.file?.filename;

    const { message, jobApplication } = await jobApplicationService.applyForJob({
      job_id: jobObjectId,
      job_seeker_id: userObjectId,
      cover_letter
    }, filePath, filename, use_existing_resume);

    sendJsonResponse(res, 201, message, { jobApplication });
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file?.path);
    };

    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));

      return res.status(422).json({
        success: false,
        errors: errorMessages
      });
    }
    next(error);
  }
};

const getAllJobsAndApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {

      if (req.user.role != UserRole.EMPLOYER) {
          throw new Unauthorized("Only Employers can fetch job applications");
      };

      const user_id = new mongoose.Types.ObjectId(req.user.user_id);
      const { message, applications } = await jobApplicationService.getAllJobsAndApplications(user_id);
      sendJsonResponse(res, 200, message, {applications});
  } catch (error) {
      next(error);
  }
};

const getJobApplicationsById = async (req: Request, res: Response, next: NextFunction) => {
  try {

      if (req.user.role != UserRole.EMPLOYER) {
          throw new Unauthorized("Only Employers can fetch job applications");
      };

      if (!req.params.job_id) {
        throw new BadRequest("job_id is required");
    };

      const user_id = new mongoose.Types.ObjectId(req.user.user_id);
      const job_id = new mongoose.Types.ObjectId(req.params.job_id);

      const { message, applications } = await jobApplicationService.getJobApplicationsByJobId(user_id, job_id);
      sendJsonResponse(res, 200, message, {applications});
  } catch (error) {
      next(error);
  }
};

const updateJobApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {

      if (req.user.role != UserRole.EMPLOYER) {
          throw new Unauthorized("Only Employers can set a job application status");
      };

      const {status } = req.body;
      const user_id = new mongoose.Types.ObjectId(req.user.user_id);
      const application_id = new mongoose.Types.ObjectId(req.body.application_id);

      const { message, job } = await jobApplicationService.updateJobApplicationStatus(user_id, application_id, status);
      sendJsonResponse(res, 200, message, {job});
  } catch (error) {
      next(error);
  }
};

const getAppliedJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const user_id = new mongoose.Types.ObjectId(req.user.user_id);
      console.log(user_id);

      const { message, applications } = await jobApplicationService.getAppliedJobs(user_id);
      sendJsonResponse(res, 200, message, {applications});
  } catch (error) {
      next(error);
  }
};


export { applyForJob, getAllJobsAndApplications, getJobApplicationsById, updateJobApplicationStatus, getAppliedJobs};
