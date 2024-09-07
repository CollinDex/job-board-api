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