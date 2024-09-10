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
 *     summary: Retrieve jobs created by the authenticated employer
 *     tags: [Job Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved created jobs
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
 *                   example: Job Fetch Successful
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
 *                           location:
 *                             type: string
 *                           min_salary:
 *                             type: number
 *                           max_salary:
 *                             type: number
 *                           job_type:
 *                             type: string
 *                             example: Full-time
 *       401:
 *         description: Unauthorized. Only employers can view created jobs.
 *       404:
 *         description: No jobs found for the employer.
 *       500:
 *         description: Server Error.
 */
`;
