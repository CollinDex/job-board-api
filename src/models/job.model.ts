import { Schema, model, SchemaTypes } from "mongoose";
import { IJob, JobStatus } from "../types";

const jobSchema = new Schema<IJob>({
    title: { type: SchemaTypes.String, required: true },
    description: { type: SchemaTypes.String, required: true },
    qualifications: [{ type: SchemaTypes.String, required: true }], 
    responsibilities: [{ type: SchemaTypes.String, required: true }],
    location: { type: SchemaTypes.String, required: true },
    min_salary: { type: Number, required: true },
    max_salary: { type: Number, required: true },
    job_type: { type: SchemaTypes.String, required: true },
    employer_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    status: { type: SchemaTypes.String, enum: JobStatus, default: JobStatus.OPEN },
    applications: [{ type: SchemaTypes.ObjectId, ref: "JobApplication", required: false }],
},
{
    timestamps: true
});


export const Job = model<IJob>('Job', jobSchema);