// Import the necessary modules
import { Router } from 'express';
import { applyForJob, getAllJobApplicationsById } from '../controllers/job-application.controller';

// Create an instance of the express router
const applicationRoute = Router();

// Define a POST route to handle job application submissions
// Endpoint: /apply
applicationRoute.post('/apply', applyForJob);

// Define a GET route to get all job applications by job ID
// Endpoint: /getAllJobs/:job_id
applicationRoute.get('/getAllJobs/:job_id', getAllJobApplicationsById);

// Export the router to be used in other parts of the application

export { applicationRoute };
