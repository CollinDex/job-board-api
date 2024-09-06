import { Request, Response } from 'express';
import { JobApplication } from '../models/job-application.model';

export const applyForJob = async (req: Request, res: Response) => {
	try {
		//Extract fields from request body
		const { job_id, job_seeker_id, cover_letter, resume } = req.body;

		// Basic validation to ensure all required fields are provided
		if (!job_id || !job_seeker_id || !cover_letter || !resume) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// Log the request body
		console.log('Request body:', req.body);

		// Check if there is already an application from this job seeker for the specified job
		console.log('Checking for existing application...');
		const existingApplication = await JobApplication.findOne({ job_id, job_seeker_id });
		if (existingApplication) {
			console.log('Existing application found:', existingApplication);
			return res.status(400).json({ message: 'Job already applied for' });
		}

		// Create a new job application entry
		console.log('Creating new application...');
		const newApplication = new JobApplication({ job_id, job_seeker_id, cover_letter, resume });

		// Save the new application to the database
		const savedApplication = await newApplication.save();

		// Log the saved application details for debugging purposes
		console.log('Saved application:', savedApplication);

		// Respond with the saved application and HTTP status 201 (Created)
		return res.status(201).json(savedApplication);
	} catch (error) {
		// Log the error and respond with HTTP status 500 (Internal Server Error)
		return res.status(500).json({ message: 'An error occurred while applying for the job', error: error.message });
	}
};

// Get all job applications

// Get job applications based on job title

// Update status of job application
