import { Router } from 'express';
import { applyForJob, getAllJobApplicationsById } from '../controllers';
import { authMiddleware } from '../middleware';
import { uploadFile } from '../middleware/uploadfile';


const jobApplicationRoute = Router();

jobApplicationRoute.post('/jobs/apply', authMiddleware, uploadFile, applyForJob);

jobApplicationRoute.get('/jobs/getAllJobs/:job_id', getAllJobApplicationsById);

export { jobApplicationRoute };