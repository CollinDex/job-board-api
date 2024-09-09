import { NextFunction, Request, Response } from 'express';
import { JobApplicationService } from '../services';
import { sendJsonResponse } from '../utils/send-response';
import { jobApplicationSchema } from '../validation-schema/job-application.schema';
import { ZodError } from "zod";
import mongoose from 'mongoose';
import { deleteFile } from '../middleware/uploadfile';

const jobApplicationService = new JobApplicationService();


const applyForJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const validatedData = jobApplicationSchema.parse(req.body);
    
    const { job_id, cover_letter } = validatedData;
    const { user_id } = req.user;
	
    const jobObjectId = new mongoose.Types.ObjectId(job_id);
	  const userObjectId = new mongoose.Types.ObjectId(user_id);

    const { message, jobApplication } = await jobApplicationService.applyForJob({
      job_id: jobObjectId,
      job_seeker_id: userObjectId,
      cover_letter
    }, req.file?.path, req.file?.filename);

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


const getAllJobApplicationsById = async (req: Request, res: Response) => {
	try {
		
		const { job_id } = req.params;

		const jobApplicationsById = await jobApplicationService.getJobApplicationsByJobId(job_id);

		return res.status(200).json(jobApplicationsById);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export { applyForJob, getAllJobApplicationsById };