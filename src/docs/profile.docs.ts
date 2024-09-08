export const userProfileDocumentation = `
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
 *                 example: "resume.pdf"
 *               profile_company:
 *                 type: string
 *                 example: "Tech Corp"
 *               profile_position:
 *                 type: string
 *                 example: "Software Engineer"
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
 *                         profile_company:
 *                           type: string
 *                         profile_position:
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