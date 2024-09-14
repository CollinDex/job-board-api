import { Router } from 'express';
import { applyForJob, getJobApplicationsById,getAllJobsAndApplications,updateJobApplicationStatus, getAppliedJobs } from '../controllers';
import { authMiddleware } from '../middleware';
import { uploadFile } from '../middleware/uploadfile';
import { validateData } from '../middleware/validationMiddleware';
import { jobApplicationStatusSchema } from '../validation-schema/job-application.schema';
import { UserRole } from '../types';
import { checkRole } from '../middleware/role';

const jobApplicationRoute = Router();

jobApplicationRoute.post('/jobs', authMiddleware, checkRole(UserRole.JOB_SEEKER), uploadFile, applyForJob);

jobApplicationRoute.get('/jobs', authMiddleware, checkRole(UserRole.EMPLOYER),getAllJobsAndApplications);

jobApplicationRoute.get('/jobs/applied', authMiddleware, checkRole(UserRole.JOB_SEEKER), getAppliedJobs);

jobApplicationRoute.get('/jobs/:job_id', authMiddleware, checkRole(UserRole.EMPLOYER), getJobApplicationsById);

jobApplicationRoute.put('/jobs/status',authMiddleware, checkRole(UserRole.EMPLOYER), validateData(jobApplicationStatusSchema), updateJobApplicationStatus);


export { jobApplicationRoute };