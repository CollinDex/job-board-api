import { Router } from "express";
import { createUserProfile, deleteUserProfile, getUserProfile, updateUserProfile, uploadResume } from "../controllers";
import { authMiddleware } from "../middleware";
import { validateData } from "../middleware/validationMiddleware";
import { jobSeekerProfileSchema, employerProfileSchema, profileSchema } from "../validation-schema/profile.schema";
import { uploadFile } from "../middleware/uploadfile";
import { checkRole } from "../middleware/role";
import { UserRole } from "../types";

const userProfileRoute = Router();

userProfileRoute.post('/profile/employer', authMiddleware, checkRole(UserRole.EMPLOYER), validateData(employerProfileSchema), createUserProfile);

userProfileRoute.post('/profile/job-seeker', authMiddleware, checkRole(UserRole.JOB_SEEKER),validateData(jobSeekerProfileSchema), createUserProfile);

userProfileRoute.get('/profile/', authMiddleware, getUserProfile);

userProfileRoute.post('/profile/upload-resume', authMiddleware, checkRole(UserRole.JOB_SEEKER), uploadFile, uploadResume );

userProfileRoute.patch('/profile/', authMiddleware, validateData(profileSchema), updateUserProfile);

userProfileRoute.delete('/profile/', authMiddleware, deleteUserProfile);



export { userProfileRoute };