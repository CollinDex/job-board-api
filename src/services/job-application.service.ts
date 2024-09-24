import { Conflict, HttpError, ResourceNotFound, Unauthorized } from '../middleware';
import { Job, JobApplication, Profile, User } from '../models';
import { IJob, IJobApplication, JobApplicationStatus, JobStatus } from '../types';
import { uploadToMega } from '../middleware/uploadfile';
import { Types } from 'mongoose';

export class JobApplicationService {
    public async applyForJob (payload:Partial<IJobApplication>, filePath:string | null, filename: string | null, useExistingResume: boolean): Promise<{
      message: string;
      jobApplication: Partial<IJobApplication>;
  }> {
      try {
          const { job_id, job_seeker_id, cover_letter, applicant_name } = payload;
          const existingApplication = await JobApplication.findOne({ job_id, job_seeker_id });

          const jobExists = await Job.findOne({_id: job_id, status: JobStatus.OPEN});

          if (existingApplication) {
            throw new Conflict("You have already applied for this job");
          }

          if (!jobExists) {
            throw new ResourceNotFound("Job does not exist or has been closed");
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
  
          const newApplication = new JobApplication({ job_id, job_seeker_id, applicant_name, cover_letter, resume });
          const savedApplication = await newApplication.save();
  
          await User.findByIdAndUpdate(
              job_seeker_id, 
              { $push: { applied_jobs: jobExists._id } },
              { new: true }
          );

          await Job.findByIdAndUpdate(
            job_id, 
            { $push: { applications: savedApplication._id } },
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
    
    public async getAllJobsAndApplications (user_id: Types.ObjectId): Promise<{message: string, applications: IJob[]}> {
        try {
            const jobs = await Job.find({employer_id: user_id}).populate('applications');

            if (!jobs) {
                throw new ResourceNotFound("No job found");
            };

            return {
                message: "Jobs and their Applications Fetch Successfully",
                applications: jobs
            };              
        } catch (error) {
            if (error instanceof HttpError) {
            throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };

	public async getJobApplicationsByJobId (user_id: Types.ObjectId, job_id: Types.ObjectId): Promise<{message: string, applications: IJob[]}> {
        try {
            const job = await Job.find({employer_id: user_id, _id: job_id}).populate('applications');

            if (!job) {
                throw new ResourceNotFound("Job not Found");
            };

            return {
                message: "Fetch Applications for single job Successful",
                applications: job
            };              
        } catch (error) {
            if (error instanceof HttpError) {
            throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };

    public async updateJobApplicationStatus (user_id:Types.ObjectId, application_id: Types.ObjectId, status: JobStatus): Promise<{message: string, job: IJobApplication}> {
        try {
            const job = await Job.findOne({ employer_id: user_id });

            if (!job.applications.includes(application_id)) {
                throw new Unauthorized("You are not the one that created this job");
            };

            const updatedJob = await JobApplication.findByIdAndUpdate(
                application_id, 
                { $set: { status: status } },
                { new: true }
            );

            if (!updatedJob) {
                throw new ResourceNotFound("JobApplication not Found");
            };

            return {
                message: "Job status updated successfully",
                job: updatedJob
            };              
        } catch (error) {
            if (error instanceof HttpError) {
            throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };

    public async getAppliedJobs (user_id: Types.ObjectId): Promise<{message: string, applications: { job: Types.ObjectId; application_status: JobApplicationStatus;
    }[]}> {
        try {
            const applications = await JobApplication.find({ job_seeker_id: user_id }).populate({path: 'job_id', select: '-applications',});
            const jobsWithApplicationStatus = applications.map(application => {    
                return {
                    job: application.job_id,
                    application_status: application.status, 
                };
            });

            return {
                message: "Fetch Applications Succesfully",
                applications: jobsWithApplicationStatus
            }
        } catch (error) {
            if (error instanceof HttpError) {
            throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    }
}
