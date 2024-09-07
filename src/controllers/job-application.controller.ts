import { NextFunction, Request, Response } from 'express';
import { JobApplicationService } from '../services';
import { sendJsonResponse } from '../utils/send-response';
import { validateData } from '../middleware/validationMiddleware';
import { jobApplicationSchema } from '../validation-schema/job-application.schema';

const jobApplicationService = new JobApplicationService();

export const applyForJob = async (req: Request, res: Response, next: NextFunction) => {
	validateData(jobApplicationSchema);
  try {
    const { job_id, cover_letter } = req.body;
	const { user_id } = req.user;

    const { message, jobApplication } = await jobApplicationService.applyForJob({
		job_id,
		job_seeker_id: user_id,
		cover_letter
	}, req.file.path, req.file.filename);

    sendJsonResponse(res, 201, message, { jobApplication });
  } catch (error) {
    next(error);
  }
};
