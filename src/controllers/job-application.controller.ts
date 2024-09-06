import { Request, Response } from "express";
import { JobApplication } from "../models/job-application.model";

const applyForJob = async (req: Request, res: Response) => {
    try {
        const { job_id, job_seeker_id, cover_letter, resume } = req.body;

        // Check if applicant has already applied for the job
        const existingApplicantDocument = await JobApplication.findOne({ job_id, job_seeker_id });
        if (existingApplicantDocument) {
            return res.status(400).json({ message: 'Job already applied for' });
        }

        // Create a new job application
        const createJobApplication = new JobApplication({
            job_id,
            job_seeker_id,
            cover_letter,
            resume
        });

        // Save the application
        const savedApplication = await createJobApplication.save();
        return res.status(201).json(savedApplication); // Respond with the saved application
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({ message: 'An error occurred while applying for the job', error });
    }
};

// Get all job applications

// Get job applications based on job title

// Update status of job application