import { NextFunction, Request, Response } from 'express';
import { JobApplicationService, getJobApplicationsByJobIdService } from '../services';
import { sendJsonResponse } from '../utils/send-response';
import { jobApplicationSchema } from '../validation-schema/job-application.schema';
import { ZodError } from "zod";
import mongoose from 'mongoose';
import { deleteFile } from '../middleware/uploadfile';

const jobApplicationService = new JobApplicationService();


const applyForJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body using Zod schema
    const validatedData = jobApplicationSchema.parse(req.body);

    // Destructure the validated data
    const { job_id, cover_letter } = validatedData;
    const { user_id } = req.user;
	
	// Convert job_id to ObjectId
    const jobObjectId = new mongoose.Types.ObjectId(job_id);
	const userObjectId = new mongoose.Types.ObjectId(user_id);

    // Call the job application service
    const { message, jobApplication } = await jobApplicationService.applyForJob({
      job_id: jobObjectId,
      job_seeker_id: userObjectId,
      cover_letter
    }, req.file?.path, req.file?.filename);

    // Send the response
    sendJsonResponse(res, 201, message, { jobApplication });
  } catch (error) {
	if (req.file) {
		await deleteFile(req.file?.path);
	};

    if (error instanceof ZodError) {
      // Handle Zod validation errors
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

// Get all job applications by Job Id
const getAllJobApplicationsById = async (req: Request, res: Response) => {
	try {
		// Extract job_id from request parameters
		const { job_id } = req.params;

		// Fetch job applications using the service
		const jobApplicationsById = await getJobApplicationsByJobIdService(job_id);

		// Send a successful response with job applications
		return res.status(200).json(jobApplicationsById);
	} catch (error) {
		// Handle errors and send a failure response
		// console.error('Error fetching job applications:', error);
		return res.status(500).json({ message: error.message });
	}
};

export { applyForJob, getAllJobApplicationsById };