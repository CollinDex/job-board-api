import { Request, Response } from 'express';
import { applyForJob } from './../controllers/job-application.controller';
import { JobApplication } from '../models/job-application.model';

jest.mock('../models/job-application.model'); // Mock the JobApplication model

describe('applyForJob', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        res = {
            status: statusMock,
            json: jsonMock
        };

        req = {
            body: {
                job_id: 'job3536',
                job_seeker_id: 'seeker562',
                cover_letter: 'This is my cover letter',
                resume: 'This is my resume'
            }
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if job already applied for', async () => {
        // Mock findOne to return an existing document
        (JobApplication.findOne as jest.Mock).mockResolvedValue({ _id: 'application123' });

        await applyForJob(req as Request, res as Response);

        expect(JobApplication.findOne).toHaveBeenCalledWith({ job_id: 'job3536', job_seeker_id: 'seeker562' });
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'Job already applied for' });
    });

    it('should save the application and return 201 on success', async () => {
        // Mock findOne to return null (no existing application)
        (JobApplication.findOne as jest.Mock).mockResolvedValue(null);

        // Mock save to return a new application object
        (JobApplication.prototype.save as jest.Mock).mockResolvedValue({
            _id: 'newApplication123',
            job_id: 'job3536',
            job_seeker_id: 'seeker562',
            cover_letter: 'This is my cover letter',
            resume: 'This is my resume'
        });

        await applyForJob(req as Request, res as Response);

        expect(JobApplication.findOne).toHaveBeenCalledWith({ job_id: 'job3536', job_seeker_id: 'seeker562' });
        expect(JobApplication.prototype.save).toHaveBeenCalled();
        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({
            _id: 'newApplication123',
            job_id: 'job3536',
            job_seeker_id: 'seeker562',
            cover_letter: 'This is my cover letter',
            resume: 'This is my resume'
        });
    });

    it('should return 500 if there is an error', async () => {
        // Mock findOne to throw an error
        (JobApplication.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
    
        await applyForJob(req as Request, res as Response);
    
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'An error occurred while applying for the job',
            error: 'Database error' // Expecting the error message as a string
        });
    });
    
});
