export const applyForJob = `
/**
 * @swagger
 * /api/v1/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Job Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_id:
 *                 type: string
 *                 example: 64bcf7b4c7e03d002bfa8994
 *               job_seeker_id:
 *                 type: string
 *                 example: 64bcf7b4c7e03d002bfa8995
 *               cover_letter:
 *                 type: string
 *                 example: I am a passionate developer looking to contribute to your team...
 *               resume:
 *                 type: string
 *                 example: link_to_resume_file.pdf
 *     responses:
 *       201:
 *         description: Job application submitted successfully
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
 *                   example: Job application submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobApplication:
 *                       type: object
 *                       properties:
 *                         job_id:
 *                           type: string
 *                         job_seeker_id:
 *                           type: string
 *                         cover_letter:
 *                           type: string
 *                         resume:
 *                           type: string
 *                         status:
 *                           type: string
 *                           example: applied
 *                         created_at:
 *                           type: string
 *                         updated_at:
 *                           type: string
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: job_id is required
 *       500:
 *         description: Some server error
 */
`;

export const getAllJobApplicationsById = `
/**
 * @swagger
 * /api/v1/getAllJobs/{job_id}:
 *   get:
 *     summary: Get all job applications by job ID
 *     tags: [Job Applications]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the job to retrieve applications for
 *         example: 64bcf7b4c7e03d002bfa8994
 *     responses:
 *       200:
 *         description: Job applications retrieved successfully
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
 *                   example: Job applications retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       job_id:
 *                         type: string
 *                       job_seeker_id:
 *                         type: string
 *                       cover_letter:
 *                         type: string
 *                       resume:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: applied
 *                       created_at:
 *                         type: string
 *                       updated_at:
 *                         type: string
 *       404:
 *         description: No applications found for the given job ID
 *       500:
 *         description: Some server error
 */
`;
