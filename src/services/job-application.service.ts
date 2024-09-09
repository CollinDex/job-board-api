import { Conflict, HttpError } from "../middleware";
import { JobApplication, User } from "../models";
import { IJobApplication } from "../types";
import { uploadToMega } from "../middleware/uploadfile";

export class JobApplicationService {
    
    public async applyForJob (payload:Partial<IJobApplication>, filePath:string, filename: string): Promise <{
        message: string;
        jobApplication: Partial<IJobApplication>;
    }> {
        try {
            
            const { job_id, job_seeker_id, cover_letter } = payload;
    
            const existingApplication = await JobApplication.findOne({ job_id, job_seeker_id });
            
            if (existingApplication) {
                throw new Conflict("You have already applied for this job");
            }

            const resume = await uploadToMega(filePath, filename);
    
            const newApplication = new JobApplication({ job_id, job_seeker_id, cover_letter, resume });
    
            const savedApplication = await newApplication.save();

            await User.findByIdAndUpdate(
                job_seeker_id, 
                { $push: { applied_jobs: savedApplication._id } },
                { new: true }
            );

            return {
                message: "Job Application Succesful",
                jobApplication: savedApplication
            }
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };
  
  // Service to get job applications By Job Id made by job seekers
    public async getJobApplicationsByJobIdService (job_id: string) => {
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
};