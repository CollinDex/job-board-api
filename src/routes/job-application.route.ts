// Import the necessary modules
import {Router} from 'express';
import { applyForJob } from '../controllers/job-application.controller';

// Create an instance of the express router
const applicationRoute = Router();

// Define a POST route to handle job application submissions
applicationRoute.post('/apply', applyForJob);

// Export the router to be used in other parts of the application

export {applicationRoute}


