import { User, Job } from "../models";
import { IJob } from "../types";
import { Conflict, HttpError, ResourceNotFound } from "../middleware";
import { Types } from "mongoose";

export class JobService {
    public async createJob (payload:Partial<IJob>): Promise<{message: string, job: IJob}> {
        try {
            const jobExists = await Job.findOne({description: payload.description, title: payload.title});

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

};