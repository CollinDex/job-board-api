import { z } from 'zod';
import { Types } from 'mongoose';
import { JobStatus } from '../types';


const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: "Invalid ObjectId",
});


const createJobSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string().min(1, { message: "Description cannot be empty" }),
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

export { createJobSchema };