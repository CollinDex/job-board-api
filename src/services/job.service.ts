import { User, Job } from '../models';
import { IJob } from '../types';
import { Conflict, HttpError, ResourceNotFound } from '../middleware';
import { Types } from 'mongoose';

export class JobService {
    public async createJob (payload:Partial<IJob>): Promise<{message: string, job: IJob}> {
        try {
            const jobExists = await Job.findOne({description: payload.description, title: payload.title, employer_id: payload.employer_id});

            if (jobExists) {
                throw new Conflict("Job with same title and description already exists");
            };

            const { employer_id } = payload; 
            const job = new Job(payload);
            const savedJob = await job.save();

            await User.findByIdAndUpdate(
                employer_id,
                { $push: { posted_jobs: savedJob._id } },
            );

            return {
                message: "Job Created Successfully",
                job: savedJob,
            };
            
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };

    public async getCreatedJobs (user_id: Types.ObjectId): Promise<{message: string, jobs: Types.ObjectId[]}> {
        try {
            const jobs = await User.findOne({_id: user_id}).populate('posted_jobs');

            if (!jobs) {
                throw new ResourceNotFound("No jobs have been created");
            };

            return {
                message: "Job Fetch Successfully",
                jobs: jobs.posted_jobs
              };              
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };

    public async updateJob (payload:Partial<IJob>, job_id:Types.ObjectId): Promise<{message: string, job: IJob}> {
        try {
            const jobExists = await Job.findOne({_id: job_id, employer_id: payload.employer_id});

            if (!jobExists) {
                throw new ResourceNotFound("Job does not exist");
            };

            const updatedJob = await Job.findByIdAndUpdate(
                job_id,
                payload,
                {new: true}
            );

            return {
                message: "Job Updated Successfully",
                job: updatedJob,
            };
            
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };

    public async deleteJob (job_id:Types.ObjectId, employer_id:Types.ObjectId): Promise<{message: string}> {
        try {
            const jobExists = await Job.findOne({_id: job_id, employer_id: employer_id});

            if (!jobExists) {
                throw new ResourceNotFound("Job does not exist");
            };

            await Job.findByIdAndDelete(
                job_id,
            );

            await User.findByIdAndUpdate(
                employer_id,
                { $pull: { posted_jobs: job_id } }
            );

            return {
                message: "Job Deleted Successfully",
            };
            
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };

};