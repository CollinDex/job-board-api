import { Router } from 'express';
import { applyForJob, getJobApplicationsById,getAllJobsAndApplications,updateJobApplicationStatus } from '../controllers';
import { authMiddleware } from '../middleware';
import { uploadFile } from '../middleware/uploadfile';
import { validateData } from '../middleware/validationMiddleware';
import { jobApplicationStatusSchema } from '../validation-schema/job-application.schema';

const jobApplicationRoute = Router();

jobApplicationRoute.post('/jobs/apply', authMiddleware, uploadFile, applyForJob);

jobApplicationRoute.get('/jobs/', authMiddleware, getAllJobsAndApplications);

jobApplicationRoute.get('/jobs/:job_id', authMiddleware, getJobApplicationsById);

jobApplicationRoute.put('/jobs/update-status',authMiddleware, validateData(jobApplicationStatusSchema),     updateJobApplicationStatus);

export { jobApplicationRoute };