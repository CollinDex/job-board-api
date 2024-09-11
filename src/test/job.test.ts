// @ts-nocheck
import { JobService } from '../services';
import { Job, User } from '../models';
import { Types } from 'mongoose';
import { Conflict, ResourceNotFound } from '../middleware';

// Mock the models
jest.mock('../models');

const mockJob = Job as jest.Mocked<typeof Job>;
const mockUser = User as jest.Mocked<typeof User>;

describe('JobService', () => {
  let jobService: JobService;

  beforeEach(() => {
    jobService = new JobService();
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a job successfully', async () => {
      const payload = {
        title: 'Software Developer',
        description: 'Experienced Developer',
        employer_id: new Types.ObjectId(),
        qualifications: ['Bachelor’s Degree', '3+ years experience'],
      };

      const savedJob = { ...payload, _id: new Types.ObjectId() };

      // Mock Job.findOne to return null (no conflict)
      mockJob.findOne.mockResolvedValue(null);

      // Mock job.save to return the saved job
      mockJob.prototype.save.mockResolvedValue(savedJob);

      // Mock User.findByIdAndUpdate to resolve successfully
      mockUser.findByIdAndUpdate.mockResolvedValue(true);

      const result = await jobService.createJob(payload);

      // Assertions
      expect(mockJob.findOne).toHaveBeenCalledWith({
        description: payload.description,
        title: payload.title,
        employer_id: payload.employer_id
      });
      expect(mockJob.prototype.save).toHaveBeenCalled();
      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        payload.employer_id,
        { $push: { posted_jobs: savedJob._id } }
      );
      expect(result).toEqual({
        message: 'Job Created Successfully',
        job: savedJob,
      });
    });

    it('should throw Conflict error if job with same title and description already exists', async () => {
      const payload = {
        title: 'Software Developer',
        description: 'Experienced Developer',
        employer_id: new Types.ObjectId(),
      };

      // Mock Job.findOne to return an existing job
      mockJob.findOne.mockResolvedValue({ title: payload.title, description: payload.description });

      await expect(jobService.createJob(payload))
        .rejects
        .toThrow(new Conflict('Job with same title and description already exists'));

      // Ensure Job.findOne was called
      expect(mockJob.findOne).toHaveBeenCalledWith({
        description: payload.description,
        title: payload.title,
        employer_id: payload.employer_id
      });
    });
  });

  describe('getCreatedJobs', () => {
    it('should return the jobs created by the employer', async () => {
      const user_id = new Types.ObjectId();
      const jobs = [
        { title: 'Software Developer', description: 'Experienced Developer', _id: new Types.ObjectId() },
        { title: 'Backend Engineer', description: 'Work with databases', _id: new Types.ObjectId() }
      ];

      // Mock User.findOne and populate method
      const mockUserWithPopulate = {
        populate: jest.fn().mockResolvedValue({ posted_jobs: jobs })
      };

      mockUser.findOne.mockReturnValue(mockUserWithPopulate as any);

      const result = await jobService.getCreatedJobs(user_id);

      // Assertions
      expect(mockUser.findOne).toHaveBeenCalledWith({ _id: user_id });
      expect(mockUserWithPopulate.populate).toHaveBeenCalledWith('posted_jobs');
      expect(result).toEqual({
        message: 'Job Fetch Successfully',
        jobs: jobs,
      });
    });

    it('should throw ResourceNotFound error if no jobs are found', async () => {
      const user_id = new Types.ObjectId();

      // Mock User.findOne to return null (no jobs found)
      const mockUserWithPopulate = {
        populate: jest.fn().mockResolvedValue(null),
      };

      mockUser.findOne.mockReturnValue(mockUserWithPopulate as any);

      await expect(jobService.getCreatedJobs(user_id))
        .rejects
        .toThrow(new ResourceNotFound('No jobs have been created'));

      expect(mockUser.findOne).toHaveBeenCalledWith({ _id: user_id });
      expect(mockUserWithPopulate.populate).toHaveBeenCalledWith('posted_jobs');
    });
  });

  describe('updateJob', () => {
    it('should update a job successfully', async () => {
      const job_id = new Types.ObjectId();
      const employer_id = new Types.ObjectId();
      const payload = { title: 'Updated Developer', employer_id };

      const job = { _id: job_id, employer_id };

      // Mock Job.findOne to find the job
      mockJob.findOne.mockResolvedValue(job);

      // Mock Job.findByIdAndUpdate to return updated job
      mockJob.findByIdAndUpdate.mockResolvedValue({ ...job, title: 'Updated Developer' });

      const result = await jobService.updateJob(payload, job_id);

      expect(mockJob.findOne).toHaveBeenCalledWith({ _id: job_id, employer_id });
      expect(mockJob.findByIdAndUpdate).toHaveBeenCalledWith(job_id, payload, { new: true });
      expect(result).toEqual({
        message: 'Job Updated Successfully',
        job: { ...job, title: 'Updated Developer' },
      });
    });

    it('should throw ResourceNotFound error if job does not exist', async () => {
      const job_id = new Types.ObjectId();
      const payload = { employer_id: new Types.ObjectId() };

      // Mock Job.findOne to return null (no job found)
      mockJob.findOne.mockResolvedValue(null);

      await expect(jobService.updateJob(payload, job_id))
        .rejects
        .toThrow(new ResourceNotFound('Job does not exist'));

      expect(mockJob.findOne).toHaveBeenCalledWith({ _id: job_id, employer_id: payload.employer_id });
    });
  });

  describe('deleteJob', () => {
    it('should delete a job successfully and unlink from user', async () => {
      const job_id = new Types.ObjectId();
      const employer_id = new Types.ObjectId();

      // Mock Job.findOne to find the job
      mockJob.findOne.mockResolvedValue({ _id: job_id, employer_id });

      // Mock Job.findByIdAndDelete to delete the job
      mockJob.findByIdAndDelete.mockResolvedValue(true);

      // Mock User.findByIdAndUpdate to unlink the job from the user's posted_jobs
      mockUser.findByIdAndUpdate.mockResolvedValue(true);

      const result = await jobService.deleteJob(job_id, employer_id);

      expect(mockJob.findOne).toHaveBeenCalledWith({ _id: job_id, employer_id });
      expect(mockJob.findByIdAndDelete).toHaveBeenCalledWith(job_id);
      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        employer_id,
        { $pull: { posted_jobs: job_id } }
      );
      expect(result).toEqual({
        message: 'Job Deleted Successfully',
      });
    });

    it('should throw ResourceNotFound error if job does not exist', async () => {
      const job_id = new Types.ObjectId();
      const employer_id = new Types.ObjectId();

      // Mock Job.findOne to return null (no job found)
      mockJob.findOne.mockResolvedValue(null);

      await expect(jobService.deleteJob(job_id, employer_id))
        .rejects
        .toThrow(new ResourceNotFound('Job does not exist'));

      expect(mockJob.findOne).toHaveBeenCalledWith({ _id: job_id, employer_id });
    });
  });
});