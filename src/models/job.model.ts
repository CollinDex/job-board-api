import { Schema, model, SchemaTypes } from "mongoose";
import { IJob } from "../types";

const jobSchema = new Schema<IJob>({
    title: { type: SchemaTypes.String, required: true },
    description: { type: SchemaTypes.String, required: true },
    qualifications: [{ type: SchemaTypes.String, required: true }], 
    responsibilities: [{ type: SchemaTypes.String, required: true }],
    location: { type: SchemaTypes.String, required: true },
    salary_range: { type: SchemaTypes.String, required: true },
    job_type: { type: SchemaTypes.String, required: true },
    employer_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    applications: [{ type: SchemaTypes.ObjectId, ref: "Job Application", required: false }],
},
{
    timestamps: true
});


export const Jobs = model<IJob>('Job', jobSchema);