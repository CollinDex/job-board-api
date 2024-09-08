import { Router } from "express";
import { createUserProfile, getUserProfile } from "../controllers";
import { authMiddleware } from "../middleware";
import { validateData } from "../middleware/validationMiddleware";
import { jobSeekerProfileSchema, employerProfileSchema } from "../validation-schema/profile.schema";

const userProfileRoute = Router();

userProfileRoute.post('/profile/employer', authMiddleware, validateData(employerProfileSchema), createUserProfile);

userProfileRoute.post('/profile/job-seeker', authMiddleware, validateData(jobSeekerProfileSchema), createUserProfile);

userProfileRoute.get('/profile/', authMiddleware, getUserProfile);


export { userProfileRoute };