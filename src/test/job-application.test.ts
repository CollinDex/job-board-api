// @ts-nocheck
import { JobApplicationService } from '../services';
import { Conflict } from '../middleware';
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
      const payload = { job_id: 'job123', job_seeker_id: 'seeker456', cover_letter: 'Cover Letter' };
      const filePath = '/path/to/resume';
      const filename = 'resume.pdf';
      const resumeLink = 'https://mega.nz/file/resume.pdf';
      const savedApplication = { _id: 'app789', ...payload, resume: resumeLink };

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
      const payload = { job_id: 'job123', job_seeker_id: 'seeker456' };
      const existingApplication = { _id: 'app789', ...payload };

      // Mock an existing job application
      (JobApplication.findOne as jest.Mock).mockResolvedValue(existingApplication);

      await expect(jobApplicationService.applyForJob(payload, '/path/to/resume', 'resume.pdf'))
        .rejects
        .toThrow(new Conflict('You have already applied for this job'));

      // Ensure findOne was called with the correct parameters
      expect(JobApplication.findOne).toHaveBeenCalledWith({ job_id: payload.job_id, job_seeker_id: payload.job_seeker_id });
      
      // Ensure no further calls were made after the conflict
      expect(uploadToMega).not.toHaveBeenCalled();
      expect(JobApplication.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe('getJobApplicationsByJobId', () => {
    it('should return job applications for a valid job ID', async () => {
      const job_id = 'job123';
      const jobApplications = [
        { _id: 'app1', job_id, job_seeker_id: 'seeker1' },
        { _id: 'app2', job_id, job_seeker_id: 'seeker2' }
      ];

      // Mock the JobApplication.find to return job applications
      (JobApplication.find as jest.Mock).mockResolvedValue(jobApplications);

      const result = await jobApplicationService.getJobApplicationsByJobId(job_id);

      // Assertions
      expect(JobApplication.find).toHaveBeenCalledWith({ job_id });
      expect(result).toEqual(jobApplications);
    });

    it('should throw an error if no job applications are found', async () => {
      const job_id = 'job123';

      // Mock the JobApplication.find to return an empty array
      (JobApplication.find as jest.Mock).mockResolvedValue([]);

      await expect(jobApplicationService.getJobApplicationsByJobId(job_id))
        .rejects
        .toThrow(`No job applications found for job ID: ${job_id}`);

      // Ensure find was called
      expect(JobApplication.find).toHaveBeenCalledWith({ job_id });
    });

    it('should handle an unexpected error when fetching job applications', async () => {
      const job_id = 'job123';
      const error = new Error('Database Error');

      // Mock the JobApplication.find to throw an error
      (JobApplication.find as jest.Mock).mockRejectedValue(error);

      await expect(jobApplicationService.getJobApplicationsByJobId(job_id))
        .rejects
        .toThrow(`Error fetching job applications: ${error.message}`);

      // Ensure find was called
      expect(JobApplication.find).toHaveBeenCalledWith({ job_id });
    });
  });
});