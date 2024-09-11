import { SearchService } from '../services';
import { Job } from '../models';
import { ResourceNotFound, HttpError } from '../middleware';

// Mock the Job model
jest.mock('../models', () => ({
  Job: {
    find: jest.fn(),
  },
}));

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    searchService = new SearchService();
    jest.clearAllMocks();
  });

  describe('getAllJobs', () => {
    it('should return jobs successfully when there are matching jobs', async () => {
      // Mock the jobs that would be returned from the Job.find query
      const mockJobs = [
        {
          title: 'Full Stack Developer',
          description: 'Develop web applications',
          location: 'Remote',
          job_type: 'Full-time',
          min_salary: 50000,
          max_salary: 100000,
        },
      ];

      // Mock Job.find to resolve with the mock jobs
      (Job.find as jest.Mock).mockResolvedValue(mockJobs);

      // Define the search parameters
      const params = {
        job_type: 'Full-time',
        location: 'Remote',
        keyword: 'Developer',
        min_salary: 50000,
        max_salary: 100000,
        status: 'OPEN',
      };

      const result = await searchService.getAllJobs(params);

      expect(Job.find).toHaveBeenCalledWith({
        job_type: 'Full-time',
        location: 'Remote',
        status: 'OPEN',
        $or: [
          { title: { $regex: 'Developer', $options: 'i' } },
          { description: { $regex: 'Developer', $options: 'i' } },
        ],
        min_salary: { $gte: 50000 },
        max_salary: { $lte: 100000 },
      });
      expect(result).toEqual({
        message: 'Jobs fetched successfully',
        jobs: mockJobs,
      });
    });

    it('should throw ResourceNotFound error when no jobs are found', async () => {
      // Mock Job.find to resolve with an empty array (no jobs found)
      (Job.find as jest.Mock).mockResolvedValue([]);

      const params = {
        job_type: 'Part-time',
        location: 'New York',
        keyword: 'Backend',
        min_salary: 40000,
        max_salary: 90000,
        status: 'CLOSED',
      };

      await expect(searchService.getAllJobs(params)).rejects.toThrow(
        new ResourceNotFound('No jobs found matching the criteria'),
      );

      expect(Job.find).toHaveBeenCalledWith({
        job_type: 'Part-time',
        location: 'New York',
        status: 'CLOSED',
        $or: [
          { title: { $regex: 'Backend', $options: 'i' } },
          { description: { $regex: 'Backend', $options: 'i' } },
        ],
        min_salary: { $gte: 40000 },
        max_salary: { $lte: 90000 },
      });
    });

    it('should throw HttpError if an unexpected error occurs', async () => {
      // Mock Job.find to throw an error
      (Job.find as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      const params = { job_type: 'Full-time', location: 'Remote' };

      await expect(searchService.getAllJobs(params)).rejects.toThrow(HttpError);

      expect(Job.find).toHaveBeenCalledWith({
        job_type: 'Full-time',
        location: 'Remote',
      });
    });
  });
});
