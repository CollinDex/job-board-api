import { Router } from "express";
import { createJob, deleteJob, getCreatedJobs, updateJob} from "../controllers";
import { authMiddleware } from "../middleware";
import { validateData } from "../middleware/validationMiddleware";
import { createJobSchema, deleteJobSchema, updateJobSchema } from "../validation-schema/job.schema";

const jobRoute = Router();

jobRoute.post('/job-listing', authMiddleware, validateData(createJobSchema), createJob);

jobRoute.get('/job-listing', authMiddleware, getCreatedJobs);

jobRoute.patch('/job-listing', authMiddleware, validateData(updateJobSchema), updateJob);

jobRoute.delete('/job-listing', authMiddleware, validateData(deleteJobSchema), deleteJob);

export { jobRoute };