export const applyForJobDoc = `
/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Job Seeker- Apply for a job
 *     tags: [Job Application]
 *     security:
 *       - bearerAuth: []
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
 *                 description: "Id of the job you want to apply for"
 *               cover_letter:
 *                 type: string
 *                 example: "I am excited to apply for this position because..."
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: "PDF, DOC, or DOCX format of your resume"
 *               use_existing_resume:
 *                 type: boolean
 *                 example: true
 *                 description: "Set to true if you want to use an existing resume from your profile. Else the resume on your profile will be used for your application"
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

export const getAllJobsAndApplicationsDoc = `
/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Employer - Fetch all jobs and their applications
 *     tags: [Job Application]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all jobs and their applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Jobs and their Applications Fetch Successfully
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       employer_id:
 *                         type: string
 *                       applications:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized - Only Employers can fetch job applications
 *       500:
 *         description: Internal Server Error
 */
`;

export const getJobApplicationsByIdDoc = `
/**
 * @swagger
 * /api/v1/jobs/{job_id}:
 *   get:
 *     summary: Employer - Fetch job applications for a specific job
 *     tags: [Job Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: job_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job to fetch applications for
 *     responses:
 *       200:
 *         description: Successfully fetched job applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetch Applications for single job Successful
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       employer_id:
 *                         type: string
 *       400:
 *         description: job_id is required
 *       401:
 *         description: Unauthorized - Only Employers can fetch job applications
 *       404:
 *         description: Job not Found
 *       500:
 *         description: Internal Server Error
 */
`;

export const updateJobApplicationStatusDoc = `
/**
 * @swagger
 * /api/v1/jobs/status:
 *   put:
 *     summary: Employer - Update the status of a job seeker's application
 *     tags: [Job Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               application_id:
 *                 type: string
 *                 example: "64db88e70e4737e7e20c7db1"
 *               status:
 *                 type: string
 *                 example: "hired || reviewed || interview | rejected"
 *     responses:
 *       200:
 *         description: Successfully updated the job application status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job status updated successfully
 *                 job:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     job_id:
 *                       type: string
 *                     job_seeker_id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "hired"
 *       401:
 *         description: Unauthorized - Only Employers can set a job application status
 *       404:
 *         description: JobApplication not Found
 *       500:
 *         description: Internal Server Error
 */
`;

export const getAppliedJobs = `
/**
 * @swagger
 * /api/v1/jobs/applied:
 *   get:
 *     summary: Job Seeeker - Fetch all jobs applications
 *     tags: [Job Application]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all job applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetch Successful
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       employer_id:
 *                         type: string
 *       500:
 *         description: Internal Server Error
 */
`;