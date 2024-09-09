import { z } from 'zod';

export const applyForJobSchema = z.object({
  job_id: z.string().nonempty({ message: 'Job ID is required' }),
  job_seeker_id: z.string().nonempty({ message: 'Job Seeker ID is required' }),
  status: z.enum(['applied', 'reviewed', 'interviewed', 'offered', 'rejected']).default('applied'),
  cover_letter: z.string().nonempty({ message: 'Cover Letter is required' }),
  resume: z.string().nonempty({ message: 'Resume is required' }),
});