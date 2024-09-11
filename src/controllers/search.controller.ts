import { Request, Response, NextFunction } from "express";
import { SearchService } from "../services";
import { sendJsonResponse } from "../utils/send-response";

const searchService = new SearchService();

const searchJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, jobs} = await searchService.getAllJobs(req.query);
        sendJsonResponse(res, 200, message, {jobs});
    } catch (error) {
        next(error);
    }
};

export { searchJobs };