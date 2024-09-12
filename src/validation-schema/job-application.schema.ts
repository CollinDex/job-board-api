import { z } from "zod";
import { Types } from "mongoose";

const jobApplicationSchema = z.object({
    job_id: z.string().min(1, { message: "job_id cannot be empty" }),
    cover_letter: z.string().min(1, { message: "Cover Letter cannot be empty" }),
    use_existing_resume: z.coerce.boolean({ message: "Must be a boolean" }).optional()
});

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
});

// Define Zod schema for status validation
const jobApplicationStatusSchema = z.object({
    application_id: objectIdSchema,
    status: z.enum(['applied', 'reviewed', 'interview', 'hired', 'rejected'], { 
    })
});

export { jobApplicationSchema,jobApplicationStatusSchema, objectIdSchema  };