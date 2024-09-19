import { Router } from "express";
import { createJob, deleteJob, getCreatedJobs, updateJob} from "../controllers";
import { authMiddleware } from "../middleware";
import { validateData } from "../middleware/validationMiddleware";
import { createJobSchema, deleteJobSchema, updateJobSchema } from "../validation-schema/job.schema";
import { checkRole } from "../middleware/role";
import { UserRole } from "../types";

const jobRoute = Router();

jobRoute.post('/job-listing', authMiddleware, checkRole(UserRole.EMPLOYER), validateData(createJobSchema), createJob);

jobRoute.get('/job-listing', authMiddleware, checkRole(UserRole.EMPLOYER), getCreatedJobs);

jobRoute.patch('/job-listing', authMiddleware, checkRole(UserRole.EMPLOYER), validateData(updateJobSchema), updateJob);

jobRoute.delete('/job-listing', authMiddleware, checkRole(UserRole.EMPLOYER), validateData(deleteJobSchema), deleteJob);

export { jobRoute };