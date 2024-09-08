import { JobApplication } from '../models/job-application.model';

// Service to apply for a job
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

// Service to get job applications By Job Id made by job seekers
export const getJobApplicationsByJobIdService = async (job_id: string) => {
	try {
		// Find all job applications made by a specific job seeker
		const jobApplicationsById = await JobApplication.find({ job_id });

		// Check if no job applications were found
		if (jobApplicationsById.length === 0) {
			throw new Error(`No job applications found for job ID: ${job_id}`);
		}

		// Return the job applications
		return jobApplicationsById;
	} catch (error) {
		console.error('Error fetching job applications:', error); // Log the error for debugging
		throw new Error(`Error fetching job applications: ${error.message}`);
	}
};
