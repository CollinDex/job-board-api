import { NextFunction, Request, Response } from 'express';
import { JobApplicationService } from '../services';
import { sendJsonResponse } from '../utils/send-response';
import { jobApplicationSchema, jobApplicationStatusSchema } from '../validation-schema/job-application.schema';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { deleteFile } from '../middleware/uploadfile';

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


const getAllJobApplicationsById = async (req: Request, res: Response) => {
	try {
		const { job_id } = req.params;

		const jobApplicationsById = await jobApplicationService.getJobApplicationsByJobId(job_id);

		return res.status(200).json(jobApplicationsById);
	} catch (error) {
		return res.status(500).json({ message: error.message });

  }
};

const updateJobApplicationStatus = async (req: Request, res: Response) => {
    try {
        // Validate the request body using the schema
        const validateStatusData = jobApplicationStatusSchema.parse(req.body);
        const { job_id, status } = validateStatusData;

        // Update the job application status
        const jobApplicationStatus = await jobApplicationService.updateJobApplicationStatus(job_id, status);


        return res.status(200).json(jobApplicationStatus);
    } catch (error) {
        if (error instanceof ZodError) {
            // Handle validation errors specifically
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }

        // Handle general server errors
        return res.status(500).json({ message: error.message });
    }
};




export { applyForJob, getAllJobApplicationsById, updateJobApplicationStatus};
