export const jobApplication = `
/**
 * @swagger
 * /api/v1/jobs/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Job Application]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               job_id:
 *                 type: string
 *                 example: "64db88e70e4737e7e20c7db1"
 *               cover_letter:
 *                 type: string
 *                 example: "I am excited to apply for this position because..."
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: "PDF, DOC, or DOCX format of your resume"
 *     responses:
 *       201:
 *         description: The job application was successfully submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Job Application Successful
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
 *                           example: "https://mega.co.nz/fake_resume_link"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: cover_letter
 *                       message:
 *                         type: string
 *                         example: "Cover Letter cannot be empty"
 *       409:
 *         description: Conflict - The user has already applied for this job
 *       500:
 *         description: Internal Server Error
 */
`;

export const getAllJobApplicationsById = `
/**
 * @swagger
 * /api/v1/jobs/getAllJobs/{job_id}:
 *   get:
 *     summary: Get all job applications by job ID
 *     tags: [Job Application]
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