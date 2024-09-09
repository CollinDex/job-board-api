// @ts-nocheck
import { JobApplicationService } from '../services';
import { Conflict, HttpError } from '../middleware';
import { JobApplication, User } from '../models';
import { uploadToMega } from '../middleware/uploadfile';

// Mock the dependencies
jest.mock('../models');
jest.mock('../middleware/uploadfile');

const jobApplicationService = new JobApplicationService();

describe('JobApplicationService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('applyForJob', () => {
        it('should apply for a job successfully', async () => {
            const payload = { job_id: '123', job_seeker_id: '456', cover_letter: 'This is my cover letter' };
            const filePath = '/path/to/resume';
            const filename = 'resume.pdf';
            const resumeLink = 'https://mega.nz/file/resume.pdf';
            const savedApplication = { _id: '789', ...payload, resume: resumeLink };

            // Mock the existing application check
            (JobApplication.findOne as jest.Mock).mockResolvedValue(null);

            // Mock the file upload to return a resume link
            (uploadToMega as jest.Mock).mockResolvedValue(resumeLink);

            // Mock saving the new application
            (JobApplication.prototype.save as jest.Mock).mockResolvedValue(savedApplication);

            // Mock updating the user's applied_jobs list
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);

            const result = await jobApplicationService.applyForJob(payload, filePath, filename);

            // Assertions
            expect(JobApplication.findOne).toHaveBeenCalledWith({ job_id: payload.job_id, job_seeker_id: payload.job_seeker_id });
            expect(uploadToMega).toHaveBeenCalledWith(filePath, filename);
            expect(JobApplication.prototype.save).toHaveBeenCalled();
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                payload.job_seeker_id,
                { $push: { applied_jobs: savedApplication._id } },
                { new: true }
            );
            expect(result).toEqual({
                message: 'Job Application Succesful',
                jobApplication: savedApplication,
            });
        });

        it('should throw Conflict error if the job application already exists', async () => {
            const payload = { job_id: '123', job_seeker_id: '456' };
            const existingApplication = { _id: '789', ...payload };

            // Mock an existing job application
            (JobApplication.findOne as jest.Mock).mockResolvedValue(existingApplication);

            await expect(jobApplicationService.applyForJob(payload, '/path/to/resume', 'resume.pdf'))
                .rejects
                .toThrow(new Conflict('You have already applied for this job'));

            // Check that findOne was called correctly
            expect(JobApplication.findOne).toHaveBeenCalledWith({ job_id: payload.job_id, job_seeker_id: payload.job_seeker_id });
            // Ensure no further calls are made when a conflict occurs
            expect(uploadToMega).not.toHaveBeenCalled();
            expect(JobApplication.prototype.save).not.toHaveBeenCalled();
        });
    });
});