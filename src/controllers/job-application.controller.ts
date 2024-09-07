import { Request, Response } from 'express';
import { applyForJobService } from '../services/job-application.service';

export const applyForJob = async (req: Request, res: Response) => {
	try {
		// Extract fields from request body
		const { job_id, job_seeker_id, cover_letter, resume } = req.body;

		// Basic validation to ensure all required fields are provided
		if (!job_id || !job_seeker_id || !cover_letter || !resume) {
			return res.status(400).json({ message: 'All fields are required' });
		}

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


// Get all job applications

// Get job applications based on job title

// Update status of job application
