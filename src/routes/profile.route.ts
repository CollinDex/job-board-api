import { Router } from "express";
import { createUserProfile, deleteUserProfile, getUserProfile, updateUserProfile, uploadResume } from "../controllers";
import { authMiddleware } from "../middleware";
import { validateData } from "../middleware/validationMiddleware";
import { jobSeekerProfileSchema, employerProfileSchema, profileSchema } from "../validation-schema/profile.schema";
import { uploadFile } from "../middleware/uploadfile";

const userProfileRoute = Router();

userProfileRoute.post('/profile/employer', authMiddleware, validateData(employerProfileSchema), createUserProfile);

userProfileRoute.post('/profile/job-seeker', authMiddleware, validateData(jobSeekerProfileSchema), createUserProfile);

userProfileRoute.get('/profile/', authMiddleware, getUserProfile);

userProfileRoute.post('/profile/upload-resume', authMiddleware, uploadFile, uploadResume );

userProfileRoute.patch('/profile/', authMiddleware, validateData(profileSchema), updateUserProfile);

userProfileRoute.delete('/profile/', authMiddleware, deleteUserProfile);



export { userProfileRoute };