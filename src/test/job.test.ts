// @ts-nocheck
import { JobService } from '../services';
import { Job, User } from '../models';
import { Types } from 'mongoose';
import { Conflict, ResourceNotFound } from '../middleware';


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
        qualifications: ['Bachelor’s Degree', '3+ years experience'],
        responsibilities: ['Develop applications', 'Work with teams'],
        location: 'Remote',
        min_salary: 60000,
        max_salary: 120000,
        job_type: 'Full-time',
        employer_id: new Types.ObjectId()
      };

      const savedJob = { ...payload, _id: new Types.ObjectId() };

      // Mock Job.findOne to return null, meaning no conflict
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
      });
      expect(mockJob.prototype.save).toHaveBeenCalled();
      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        payload.employer_id,
        { $push: { posted_jobs: savedJob._id } },
      );
      expect(result).toEqual({
        message: 'Job Created Successfully',
        job: savedJob,
      });
    });

    it('should throw a Conflict error if a job with the same title and description already exists', async () => {
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
      
        // Mock User.findOne and its populate method
        const mockUserWithPopulate = {
          populate: jest.fn().mockResolvedValue({ posted_jobs: jobs })
        };
      
        mockUser.findOne.mockReturnValue(mockUserWithPopulate);
      
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
      
        // Mock User.findOne and its populate method to return null
        const mockUserWithPopulate = {
          populate: jest.fn().mockResolvedValue(null),
        };
      
        mockUser.findOne.mockReturnValue(mockUserWithPopulate);
      
        await expect(jobService.getCreatedJobs(user_id))
          .rejects
          .toThrow(new ResourceNotFound('No jobs have been created'));
      
        expect(mockUser.findOne).toHaveBeenCalledWith({ _id: user_id });
        expect(mockUserWithPopulate.populate).toHaveBeenCalledWith('posted_jobs');
      });      
  });
});
