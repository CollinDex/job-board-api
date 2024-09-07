import { Router } from 'express';
import { applyForJob } from '../controllers';
import { authMiddleware } from '../middleware';
import { uploadFile } from '../middleware/uploadfile';

const jobApplicationRoute = Router();

// Define a POST route to handle job application submissions
jobApplicationRoute.post('/apply', authMiddleware, uploadFile, applyForJob);

export { jobApplicationRoute };
