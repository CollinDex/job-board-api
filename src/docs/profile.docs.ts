export const userProfileDocs = `
/**
 * @swagger
 * /api/v1/profile/employer:
 *   post:
 *     summary: Create Employer Profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_name:
 *                 type: string
 *                 example: John Doe
 *               profile_phone:
 *                 type: string
 *                 example: "+1234567890"
 *               profile_address:
 *                 type: string
 *                 example: "123 Company St, City, Country"
 *               profile_company:
 *                 type: string
 *                 example: "Tech Corp"
 *               profile_position:
 *                 type: string
 *                 example: "CEO"
 *               profile_company_address:
 *                 type: string
 *                 example: "123 Business Rd, City, Country"
 *     responses:
 *       201:
 *         description: Employer profile created successfully
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
 *                   example: Profile Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 12345
 *                         profile_name:
 *                           type: string
 *                           example: John Doe
 *                         profile_phone:
 *                           type: string
 *                         profile_address:
 *                           type: string
 *                         profile_company:
 *                           type: string
 *                         profile_position:
 *                           type: string
 *                         profile_company_address:
 *                           type: string
 *                         user_id:
 *                           type: string
 *                           example: 67890
 *       409:
 *         description: User already has a profile
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/profile/job-seeker:
 *   post:
 *     summary: Create Job Seeker Profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_name:
 *                 type: string
 *                 example: John Doe
 *               profile_phone:
 *                 type: string
 *                 example: "+1234567890"
 *               profile_address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *               profile_resume:
 *                 type: string
 *                 example: "https://mega.nz/file/MiUhxYxR#cs0JiiqLfnDXLoA4kcx6AIddRi8W7Dy1954ieFmpzNA"
 *     responses:
 *       201:
 *         description: Job seeker profile created successfully
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
 *                   example: Profile Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 12345
 *                         profile_name:
 *                           type: string
 *                         profile_phone:
 *                           type: string
 *                         profile_address:
 *                           type: string
 *                         profile_resume:
 *                           type: string
 *                         user_id:
 *                           type: string
 *                           example: 67890
 *       409:
 *         description: User already has a profile
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get User Profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
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
 *                   example: Profile fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 12345
 *                         profile_name:
 *                           type: string
 *                           example: John Doe
 *                         profile_phone:
 *                           type: string
 *                           example: "+1234567890"
 *                         profile_address:
 *                           type: string
 *                           example: "123 Main St, City, Country"
 *                         profile_resume:
 *                           type: string
 *                           example: "resume.pdf"
 *                         profile_company:
 *                           type: string
 *                           example: "Tech Corp"
 *                         profile_position:
 *                           type: string
 *                           example: "Software Engineer"
 *       404:
 *         description: User profile not found
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
`;

export const uploadResumeDocs= `
/**
 * @swagger
 * /api/v1/profile/upload-resume:
 *   post:
 *     summary: Upload Resume for User Profile
 *     description: Allows authenticated users to upload their resume as part of their profile. The resume will be uploaded and stored in the cloud (Mega).
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: The resume file to be uploaded (PDF, Word document).
 *     responses:
 *       201:
 *         description: Resume uploaded successfully.
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
 *                   example: Resume Upload Succesful
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         profile_name:
 *                           type: string
 *                         profile_resume:
 *                           type: string
 *                           example: https://mega.nz/resume.pdf
 *                         updated_at:
 *                           type: string
 *                           example: 2024-09-10T08:30:00Z
 *       409:
 *         description: User Profile Not Found
 *       500:
 *         description: Internal Server Error
 */
`;

export const updateUserProfileDocs = `
/**
 * @swagger
 * /api/v1/profile:
 *   patch:
 *     summary: Update User Profile
 *     description: Updates the user's profile information.
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_name:
 *                 type: string
 *                 example: John Doe
 *               profile_phone:
 *                 type: string
 *                 example: 123456789
 *               profile_address:
 *                 type: string
 *                 example: 123 Main St
 *               profile_company:
 *                 type: string
 *                 example: Tech Corp
 *               profile_position:
 *                 type: string
 *                 example: Software Engineer
 *               profile_company_address:
 *                 type: string
 *                 example: 456 Tech Park, Silicon Valley
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *                       properties:
 *                         profile_name:
 *                           type: string
 *                         profile_phone:
 *                           type: string
 *                         profile_address:
 *                           type: string
 *                         profile_company:
 *                           type: string
 *                         profile_position:
 *                           type: string
 *                         profile_company_address:
 *                           type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */
`;

export const deleteUserProfileDocs = `
/**
 * @swagger
 * /api/v1/profile:
 *   delete:
 *     summary: Delete User Profile
 *     description: Deletes the user's profile.
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 *       404:
 *         description: User profile not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
`;
