import { Router } from "express";
import { searchJobs } from "../controllers/search.controller";


const jobSearchRoute = Router();

jobSearchRoute.get('/search', searchJobs);

export { jobSearchRoute };
