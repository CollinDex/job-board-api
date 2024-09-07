import { z } from "zod";

const jobApplicationSchema = z.object({
    job_id: z.string().min(1, { message: "job_id cannot be empty" }).uuid({ message: "Invalid ID Format" }),
    cover_letter: z.string().min(1, { message: "Cover Letter cannot be empty" })
  });

export { jobApplicationSchema };
