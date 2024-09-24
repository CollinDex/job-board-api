import { Schema, model, SchemaTypes } from "mongoose";
import { IJobApplication, JobApplicationStatus } from "../types";

const jobApplicationSchema = new Schema<IJobApplication>({
    job_id: { type: SchemaTypes.ObjectId, ref: "Job", required: true},
    applicant_name: { type: SchemaTypes.String, required: true },
    job_seeker_id: { type: SchemaTypes.ObjectId, ref: "User", required: true},
    status: { type: SchemaTypes.String, enum: JobApplicationStatus, default: JobApplicationStatus.APPLIED, required: true },
    cover_letter: { type: SchemaTypes.String, required: true },
    resume: { type: SchemaTypes.String, required: true },
},
{
    timestamps: true
});

export const JobApplication = model<IJobApplication>('JobApplication', jobApplicationSchema);