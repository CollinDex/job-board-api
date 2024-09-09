import { Request, Response } from 'express';
import { applyForJobService, getJobApplicationsByJobIdService } from '../services/job-application.service';

export const applyForJob = async (req: Request, res: Response) => {
	try {
		// Extract fields from request body
		const { job_id, job_seeker_id, cover_letter, resume } = req.body;


		// Call service to handle the business logic
		const savedApplication = await applyForJobService(job_id, job_seeker_id, cover_letter, resume);

		// Respond with the saved application and HTTP status 201 (Created)
		return res.status(201).json(savedApplication);
	} catch (error) {
		// Handle known error
		if (error.message === 'Job already applied for') {
			return res.status(400).json({ message: error.message });
		}

		// Log the error and respond with HTTP status 500 (Internal Server Error)
		return res.status(500).json({ message: 'An error occurred while applying for the job', error: error.message });
	}
};

// Get all job applications by Job Id
export const getAllJobApplicationsById = async (req: Request, res: Response) => {
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

// Get job applications based on job title

// Update status of job application
