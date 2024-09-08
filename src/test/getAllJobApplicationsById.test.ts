import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { getAllJobApplicationsById } from '../controllers/job-application.controller';
import { getJobApplicationsByJobIdService } from '../services/job-application.service';

// Mock the service
jest.mock('../services/job-application.service');

// Create an instance of Express app and apply routes
const app = express();
const applicationRoute = Router();
applicationRoute.get('/getAllJobs/:job_id', getAllJobApplicationsById);
app.use('/api/v1/', applicationRoute);

describe('GET /api/v1/getAllJobs/:job_id', () => {
    it('should return job applications for a valid job_id', async () => {
        // Arrange
        const job_id = '3467';
        const mockJobApplications = [{ job_id, applicant: 'Martin James', status: 'applied' }];
        (getJobApplicationsByJobIdService as jest.Mock).mockResolvedValue(mockJobApplications);

        // Act
        const response = await request(app).get(`/api/v1/getAllJobs/${job_id}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobApplications);
    });

    
      
      

    it('should return 500 on service error', async () => {
        // Arrange
        const job_id = '3467';
        (getJobApplicationsByJobIdService as jest.Mock).mockRejectedValue(new Error('Service error'));

        // Act
        const response = await request(app).get(`/api/v1/getAllJobs/${job_id}`);

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Service error' }); // Changed to match JSON response format
    });
});
