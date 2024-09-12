import { Conflict, HttpError } from '../middleware';
import { JobApplication, Profile, User } from '../models';
import { IJobApplication } from '../types';
import { uploadToMega } from '../middleware/uploadfile';

export class JobApplicationService {
    public async applyForJob (payload:Partial<IJobApplication>, filePath:string | null, filename: string | null, useExistingResume: boolean): Promise<{
      message: string;
      jobApplication: Partial<IJobApplication>;
  }> {
      try {
          const { job_id, job_seeker_id, cover_letter } = payload;
          const existingApplication = await JobApplication.findOne({ job_id, job_seeker_id });
          
          if (existingApplication) {
              throw new Conflict("You have already applied for this job");
          }
  
          let resume: string | null = null;
  
          if (useExistingResume) {
              const userProfile = await Profile.findOne({user_id: job_seeker_id});
              if ( !userProfile || !userProfile.profile_resume) {
                  throw new Conflict("No resume found on your profile. Please upload a resume.");
              }
              resume = userProfile.profile_resume;
          } else if (filePath && filename) {
              resume = await uploadToMega(filePath, filename);
          } else {
              throw new Conflict("No resume provided for the job application.");
          }
  
          const newApplication = new JobApplication({ job_id, job_seeker_id, cover_letter, resume });
          const savedApplication = await newApplication.save();
  
          await User.findByIdAndUpdate(
              job_seeker_id, 
              { $push: { applied_jobs: savedApplication._id } },
              { new: true }
          );
  
          return {
              message: "Job Application Successful",
              jobApplication: savedApplication
          };
      } catch (error) {
          if (error instanceof HttpError) {
              throw error;
          }
          throw new HttpError(error.status || 500, error.message || error);
      }
  };
  

	public async getJobApplicationsByJobId(job_id: string) {
		try {
			const jobApplicationsById = await JobApplication.find({ job_id });

			if (jobApplicationsById.length === 0) {
				throw new Error(`No job applications found for job ID: ${job_id}`);
			}

			return jobApplicationsById;
		} catch (error) {
			console.error('Error fetching job applications:', error);
			throw new Error(`Error fetching job applications: ${error.message}`);
		}
	}
	public async updateJobApplicationStatus(job_id: string, status: string): Promise<void> {
		try {
			const jobApplicationStatus = await JobApplication.updateOne({ job_id }, { $set: { status } });

			if (jobApplicationStatus.modifiedCount > 0) {
				console.log('Job application status updated successfully');
			} else {
				console.log('No job application was modified');
			}
		} catch (error) {
			console.error('Error updating job application status', error);
			throw new Error('Unable to update job application status');
		}
	}
}
