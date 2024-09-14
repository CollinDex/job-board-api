import { Router } from 'express';
import { applyForJob, getJobApplicationsById,getAllJobsAndApplications,updateJobApplicationStatus, getAppliedJobs } from '../controllers';
import { authMiddleware } from '../middleware';
import { uploadFile } from '../middleware/uploadfile';
import { validateData } from '../middleware/validationMiddleware';
import { jobApplicationStatusSchema } from '../validation-schema/job-application.schema';

const jobApplicationRoute = Router();

jobApplicationRoute.post('/jobs', authMiddleware, uploadFile, applyForJob);

jobApplicationRoute.get('/jobs', authMiddleware, getAllJobsAndApplications);

jobApplicationRoute.get('/jobs/applied', authMiddleware, getAppliedJobs);

jobApplicationRoute.get('/jobs/:job_id', authMiddleware, getJobApplicationsById);

jobApplicationRoute.put('/jobs/status',authMiddleware, validateData(jobApplicationStatusSchema), updateJobApplicationStatus);


export { jobApplicationRoute };