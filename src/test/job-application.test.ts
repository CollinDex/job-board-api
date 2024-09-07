import { Request, Response } from 'express';
import { applyForJob } from './../controllers/job-application.controller';
import { applyForJobService } from './../services/job-application.service';

jest.mock('./../services/job-application.service'); // Mock the service

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
        // Mock applyForJobService to throw an error indicating job already applied for
        (applyForJobService as jest.Mock).mockRejectedValue(new Error('Job already applied for'));

        await applyForJob(req as Request, res as Response);

        expect(applyForJobService).toHaveBeenCalledWith('job3536', 'seeker562', 'This is my cover letter', 'This is my resume');
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'Job already applied for' });
    });

    it('should save the application and return 201 on success', async () => {
        // Mock applyForJobService to return a new application object
        (applyForJobService as jest.Mock).mockResolvedValue({
            _id: 'newApplication123',
            job_id: 'job3536',
            job_seeker_id: 'seeker562',
            cover_letter: 'This is my cover letter',
            resume: 'This is my resume'
        });

        await applyForJob(req as Request, res as Response);

        expect(applyForJobService).toHaveBeenCalledWith('job3536', 'seeker562', 'This is my cover letter', 'This is my resume');
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
        // Mock applyForJobService to throw a generic error
        (applyForJobService as jest.Mock).mockRejectedValue(new Error('Database error'));

        await applyForJob(req as Request, res as Response);

        expect(applyForJobService).toHaveBeenCalledWith('job3536', 'seeker562', 'This is my cover letter', 'This is my resume');
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'An error occurred while applying for the job',
            error: 'Database error'
        });
    });
});
