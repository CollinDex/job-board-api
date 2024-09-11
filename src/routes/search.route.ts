import { Router } from "express";
import { searchJobs } from "../controllers/search.controller";
import { authMiddleware } from "../middleware";

const jobSearchRoute = Router();

jobSearchRoute.get('/search', authMiddleware, searchJobs);

export { jobSearchRoute };
