export const searchJobsDoc = `
/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Search for jobs
 *     tags: [Job Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: job_type
 *         schema:
 *           type: string
 *         description: Filter jobs by type (e.g., Full-time, Part-time)
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter jobs by location (e.g., Remote, New York)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search for jobs by title or description keyword
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, CLOSED, PENDING]
 *         description: Filter jobs by status
 *       - in: query
 *         name: min_salary
 *         schema:
 *           type: number
 *           example: 50000
 *         description: Filter jobs by minimum salary
 *       - in: query
 *         name: max_salary
 *         schema:
 *           type: number
 *           example: 100000
 *         description: Filter jobs by maximum salary
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
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
 *                   example: Jobs fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: Full Stack Developer
 *                           description:
 *                             type: string
 *                             example: Develop and maintain web applications
 *                           job_type:
 *                             type: string
 *                             example: Full-time
 *                           location:
 *                             type: string
 *                             example: Remote
 *                           min_salary:
 *                             type: number
 *                             example: 50000
 *                           max_salary:
 *                             type: number
 *                             example: 100000
 *                           status:
 *                             type: string
 *                             example: OPEN
 *                           employer_id:
 *                             type: string
 *                             example: 60d21b4667d0d8992e610c85
 *       401:
 *         description: Unauthorized. Only authenticated users can search for jobs.
 *       404:
 *         description: No jobs found matching the criteria
 *       500:
 *         description: Some server error
 */
`;
