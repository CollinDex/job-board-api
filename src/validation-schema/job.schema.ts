import { z } from 'zod';
import { Types } from 'mongoose';
import { JobStatus } from '../types';

const createJobSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string().min(1, { message: "Description cannot be empty" }),
  company: z.string().min(1, { message: "Company cannot be empty" }),
  qualifications: z.array(z.string().min(1, { message: "Qualification cannot be empty" })),
  responsibilities: z.array(z.string().min(1, { message: "Responsibility cannot be empty" })),
  location: z.string().min(1, { message: "Location cannot be empty" }),
  min_salary: z.number().min(0, { message: "Minimum salary must be greater than or equal to 0" }),
  max_salary: z.number().min(0, { message: "Maximum salary must be greater than or equal to 0" }),
  job_type: z.string().min(1, { message: "Job type cannot be empty" }),
  status: z.nativeEnum(JobStatus, { errorMap: () => ({ message: "Invalid job status" }) }),
}).superRefine((data, ctx) => {
  if (data.max_salary < data.min_salary) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['max_salary'],
      message: "Max salary should be greater than or equal to min salary",
    });
  }
});


const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: "Invalid ObjectId",
});

const updateJobSchema = z.object({
  job_id: objectIdSchema,
  title: z.string().min(1, { message: "Title cannot be empty" }).optional(),
  description: z.string().min(1, { message: "Description cannot be empty" }).optional(),
  company: z.string().min(1, { message: "Company cannot be empty" }).optional(),
  qualifications: z.array(z.string().min(1, { message: "Qualification cannot be empty" })).optional(),
  responsibilities: z.array(z.string().min(1, { message: "Responsibility cannot be empty" })).optional(),
  location: z.string().min(1, { message: "Location cannot be empty" }).optional(),
  min_salary: z.number().min(0, { message: "Minimum salary must be greater than or equal to 0" }).optional(),
  max_salary: z.number().min(0, { message: "Maximum salary must be greater than or equal to 0" }).optional(),
  job_type: z.string().min(1, { message: "Job type cannot be empty" }).optional(),
  status: z.nativeEnum(JobStatus, { errorMap: () => ({ message: "Invalid job status" }) }).optional(),
})
.superRefine((data, ctx) => {
  // Ensure both min_salary and max_salary are present before comparing
  if (data.min_salary && data.max_salary && data.max_salary < data.min_salary) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['max_salary'],
      message: "Max salary should be greater than or equal to min salary",
    });
  }
});

const deleteJobSchema = z.object({
  job_id : objectIdSchema
});

export { createJobSchema, updateJobSchema, deleteJobSchema };