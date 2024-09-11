import { z } from "zod";

const jobApplicationSchema = z.object({
    job_id: z.string().min(1, { message: "job_id cannot be empty" }),
    cover_letter: z.string().min(1, { message: "Cover Letter cannot be empty" })
});

// Define Zod schema for status validation
const jobApplicationStatusSchema = z.object({
    job_id: z.string().min(1, { message: "Job ID cannot be empty" }),
    job_seeker_id: z.string().min(1, { message: "Job Seeker ID cannot be empty" }),
    status: z.enum(['applied', 'interviewing', 'hired', 'rejected', 'open'], { 
    })
});
export { jobApplicationSchema,jobApplicationStatusSchema  };
