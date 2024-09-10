import { Router } from "express";
import { createJob, getCreatedJobs} from "../controllers";
import { authMiddleware } from "../middleware";
import { validateData } from "../middleware/validationMiddleware";
import { createJobSchema } from "../validation-schema/job.schema";

const jobRoute = Router();

jobRoute.post('/job-listing', authMiddleware, validateData(createJobSchema), createJob);

jobRoute.get('/job-listing', authMiddleware, getCreatedJobs);

export { jobRoute };