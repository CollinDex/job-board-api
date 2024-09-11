export const createJobDoc = `
/**
 * @swagger
 * /api/v1/job-listing:
 *   post:
 *     summary: Create a new job listing
 *     tags: [Job Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior Developer
 *               description:
 *                 type: string
 *                 example: Looking for an experienced developer
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Bachelor's degree in Computer Science", "3+ years of experience"]
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Develop and maintain applications", "Collaborate with team members"]
 *               location:
 *                 type: string
 *                 example: Remote
 *               min_salary:
 *                 type: number
 *                 example: 60000
 *               max_salary:
 *                 type: number
 *                 example: 120000
 *               job_type:
 *                 type: string
 *                 example: Full-time
 *     responses:
 *       201:
 *         description: Job Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Job Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     job:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         employer_id:
 *                           type: string
 *                           example: 60d21b4667d0d8992e610c85
 *       401:
 *         description: Unauthorized. Only employers can create jobs.
 *       409:
 *         description: Conflict. Job with the same title and description already exists.
 *       500:
 *         description: Server Error.
 */
`;

export const getCreatedJobsDoc = `
/**
 * @swagger
 * /api/v1/job-listing:
 *   get:
 *     summary: Get jobs created by the employer
 *     tags: [Job Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job Fetch Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Job Fetch Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           employer_id:
 *                             type: string
 *       401:
 *         description: Unauthorized. Only employers can fetch jobs they created.
 *       404:
 *         description: No jobs found for the employer.
 *       500:
 *         description: Server Error.
 */
`;

export const updateJobDoc = `
/**
 * @swagger
 * /api/v1/job-listing:
 *   patch:
 *     summary: Update a job listing
 *     tags: [Job Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_id:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               title:
 *                 type: string
 *                 example: Updated Job Title
 *               description:
 *                 type: string
 *                 example: Updated job description
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Master's degree in Computer Science"]
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Update software applications", "Lead a team"]
 *               location:
 *                 type: string
 *                 example: New York, NY
 *               min_salary:
 *                 type: number
 *                 example: 70000
 *               max_salary:
 *                 type: number
 *                 example: 150000
 *               job_type:
 *                 type: string
 *                 example: Full-time
 *     responses:
 *       200:
 *         description: Job Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Job Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     job:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         employer_id:
 *                           type: string
 *       401:
 *         description: Unauthorized. Only employers can update jobs.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Server Error.
 */
`;

export const deleteJobDoc = `
/**
 * @swagger
 * /api/v1/job-listing:
 *   delete:
 *     summary: Delete a job listing
 *     tags: [Job Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_id:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       204:
 *         description: Job Deleted Successfully
 *       401:
 *         description: Unauthorized. Only employers can delete jobs.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Server Error.
 */
`;