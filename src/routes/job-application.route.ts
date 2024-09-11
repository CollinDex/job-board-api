import { Router } from 'express';
import { applyForJob, getAllJobApplicationsById,updateJobApplicationStatus } from '../controllers';
import { authMiddleware } from '../middleware';
import { uploadFile } from '../middleware/uploadfile';


const jobApplicationRoute = Router();

jobApplicationRoute.post('/jobs/apply', authMiddleware, uploadFile, applyForJob);

jobApplicationRoute.get('/jobs/getAllJobs/:job_id', getAllJobApplicationsById);

jobApplicationRoute.put('./jobs/updateJobApplicationStatus', updateJobApplicationStatus)


export { jobApplicationRoute };