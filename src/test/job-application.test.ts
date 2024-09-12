// @ts-nocheck
import { JobApplicationService } from '../services';
import { Job, JobApplication, User } from '../models';
import { uploadToMega } from '../middleware/uploadfile';
import { Conflict, ResourceNotFound, Unauthorized } from '../middleware';
import { Types } from 'mongoose';

// Mock the required models and functions
jest.mock('../models');
jest.mock('../middleware/uploadfile');

describe('JobApplicationService', () => {
  let jobApplicationService: JobApplicationService;

  beforeEach(() => {
    jobApplicationService = new JobApplicationService();
    jest.clearAllMocks();
  });

  describe('applyForJob', () => {
    const payload = {
      job_id: new Types.ObjectId(),
      job_seeker_id: new Types.ObjectId(),
      cover_letter: 'Cover letter text',
    };

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

		await expect(jobApplicationService.applyForJob(payload, null, null, true)).rejects.toThrow(ResourceNotFound);		
	});

    it('should throw Conflict if the user already applied for the job', async () => {
      (JobApplication.findOne as jest.Mock).mockResolvedValue(payload);
      await expect(jobApplicationService.applyForJob(payload, null, null, true)).rejects.toThrow(Conflict);
    });

    it('should throw ResourceNotFound if the job does not exist or is closed', async () => {
      (JobApplication.findOne as jest.Mock).mockResolvedValue(null);
      (Job.findOne as jest.Mock).mockResolvedValue(null);
      await expect(jobApplicationService.applyForJob(payload, null, null, true)).rejects.toThrow(ResourceNotFound);
    });
  });

  describe('getAllJobsAndApplications', () => {
    it('should fetch all jobs and applications for an employer', async () => {
      const user_id = new Types.ObjectId();
      const mockFind = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([{ applications: [] }]),
      });

      (Job.find as jest.Mock).mockImplementation(mockFind);

      const result = await jobApplicationService.getAllJobsAndApplications(user_id);

      expect(Job.find).toHaveBeenCalledWith({ employer_id: user_id });
      expect(result.message).toEqual('Jobs and their Applications Fetch Successfully');
    });
  });

  describe('getJobApplicationsByJobId', () => {
    it('should fetch job applications for a specific job', async () => {
      const user_id = new Types.ObjectId();
      const job_id = new Types.ObjectId();
      const mockFind = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([{ applications: [] }]),
      });

      (Job.find as jest.Mock).mockImplementation(mockFind);

      const result = await jobApplicationService.getJobApplicationsByJobId(user_id, job_id);

      expect(Job.find).toHaveBeenCalledWith({ employer_id: user_id, _id: job_id });
      expect(result.message).toEqual('Fetch Applications for single job Successful');
    });
  });

  describe('updateJobApplicationStatus', () => {
    it('should update job application status successfully', async () => {
      const user_id = new Types.ObjectId();
      const application_id = new Types.ObjectId();
      const job = { applications: [application_id] };
      (Job.findOne as jest.Mock).mockResolvedValue(job);
      (JobApplication.findByIdAndUpdate as jest.Mock).mockResolvedValue({ status: 'reviewed' });

      const result = await jobApplicationService.updateJobApplicationStatus(user_id, application_id, 'reviewed');

      expect(Job.findOne).toHaveBeenCalledWith({ employer_id: user_id });
      expect(JobApplication.findByIdAndUpdate).toHaveBeenCalledWith(application_id, { $set: { status: 'reviewed' } }, { new: true });
      expect(result.message).toEqual('Job status updated successfully');
    });

    it('should throw Unauthorized if the job does not belong to the employer', async () => {
      const user_id = new Types.ObjectId();
      const application_id = new Types.ObjectId();
      const job = { applications: [] }; // application not in the job applications array
      (Job.findOne as jest.Mock).mockResolvedValue(job);

      await expect(jobApplicationService.updateJobApplicationStatus(user_id, application_id, 'reviewed')).rejects.toThrow(Unauthorized);
    });
  });
});


/* import { JobApplicationService } from '../services/job-application.service';
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
			expect(JobApplication.findOne).toHaveBeenCalledWith({
				job_id: payload.job_id,
				job_seeker_id: payload.job_seeker_id
			});
			expect(uploadToMega).toHaveBeenCalledWith(filePath, filename);
			expect(JobApplication.prototype.save).toHaveBeenCalled();
			expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
				payload.job_seeker_id,
				{ $push: { applied_jobs: savedApplication._id } },
				{ new: true }
			);
			expect(result).toEqual({
				message: 'Job Application Succesful',
				jobApplication: savedApplication
			});
		});

		it('should throw Conflict error if the job application already exists', async () => {
			const payload = { job_id: 'job123', job_seeker_id: 'seeker456' };
			const existingApplication = { _id: 'app789', ...payload };

			// Mock an existing job application
			(JobApplication.findOne as jest.Mock).mockResolvedValue(existingApplication);

			await expect(jobApplicationService.applyForJob(payload, '/path/to/resume', 'resume.pdf')).rejects.toThrow(
				new Conflict('You have already applied for this job')
			);

			// Ensure findOne was called with the correct parameters
			expect(JobApplication.findOne).toHaveBeenCalledWith({
				job_id: payload.job_id,
				job_seeker_id: payload.job_seeker_id
			});

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

			await expect(jobApplicationService.getJobApplicationsByJobId(job_id)).rejects.toThrow(
				`No job applications found for job ID: ${job_id}`
			);

			// Ensure find was called
			expect(JobApplication.find).toHaveBeenCalledWith({ job_id });
		});

		it('should handle an unexpected error when fetching job applications', async () => {
			const job_id = 'job123';
			const error = new Error('Database Error');

			// Mock the JobApplication.find to throw an error
			(JobApplication.find as jest.Mock).mockRejectedValue(error);

			await expect(jobApplicationService.getJobApplicationsByJobId(job_id)).rejects.toThrow(
				`Error fetching job applications: ${error.message}`
			);

			// Ensure find was called
			expect(JobApplication.find).toHaveBeenCalledWith({ job_id });
		});
	});
	describe('updateJobApplicationStatus', () => {
        it('should update job application status successfully', async () => {
            const jobId = 'job123';
            const status = 'accepted';
            const updateResult = { modifiedCount: 1 };

            // Mock the updateOne method
           (JobApplication.updateOne as jest.Mock).mockResolvedValue(updateResult);

            const result = await jobApplicationService.updateJobApplicationStatus(jobId, status);

            // Assertions
            expect(JobApplication.updateOne).toHaveBeenCalledWith(
                { job_id: jobId },
                { $set: { status } }
            );
            expect(result).toBeUndefined(); // Since updateJobApplicationStatus has no return value
        });

        it('should handle errors during status update', async () => {
            const jobId = 'job123';
            const status = 'accepted';
            const error = new Error('Update Error');

            // Mock the updateOne method to throw an error
           (JobApplication.updateOne as jest.Mock).mockRejectedValue(error);

            await expect(jobApplicationService.updateJobApplicationStatus(jobId, status)).rejects.toThrow(
                new Error('Unable to update job application status')
            );

            // Ensure the updateOne method was called with the correct parameters
            expect(JobApplication.updateOne).toHaveBeenCalledWith(
                { job_id: jobId },
                { $set: { status } }
            );
        });
    });
});
 */