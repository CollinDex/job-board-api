import { JobApplication } from '../models/job-application.model';

export const applyForJobService = async (
	job_id: string, 
	job_seeker_id: string, 
	cover_letter: string, 
	resume: string
) => {
	// Check if there is already an application from this job seeker for the specified job
	const existingApplication = await JobApplication.findOne({ job_id, job_seeker_id });
	if (existingApplication) {
		throw new Error('Job already applied for');
	}

	// Create a new job application entry
	const newApplication = new JobApplication({ job_id, job_seeker_id, cover_letter, resume });

	// Save the new application to the database
	const savedApplication = await newApplication.save();
	return savedApplication;
};
