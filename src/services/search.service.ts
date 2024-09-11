import { Job } from "../models";
import { IJob } from "../types";
import { HttpError, ResourceNotFound } from "../middleware";
import { MongooseBaseQueryOptions } from "mongoose";

interface JobSearchQuery {
    job_type?: string;
    location?: string;
    keyword?: string;
    status?:string;
    min_salary?: number;
    max_salary?: number;
}

export class SearchService {
    public async getAllJobs(params: JobSearchQuery): Promise<{message: string, jobs: IJob[]}> {
        try {
            const { job_type, location, keyword, min_salary, max_salary, status } = params;

            const query: MongooseBaseQueryOptions = {};
            if (job_type) {
                query.job_type = job_type;
            }
            if (status) {
                query.status = status;
            }
            if (location) {
                query.location = location;
            }
            if (keyword) {
                query.$or = [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } }
                ];
            }
            if (min_salary && max_salary) {
                query.min_salary = { $gte: Number(min_salary) };
                query.max_salary = { $lte: Number(max_salary) };
            }
            
            const jobs = await Job.find(query);
            
            if (!jobs.length) {
                throw new ResourceNotFound("No jobs found matching the criteria");
            };

            return {
                message: "Jobs fetched successfully",
                jobs: jobs
            };

        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    };
};