import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services";
import { sendJsonResponse } from "../utils/send-response";
import mongoose from "mongoose";

const profileService = new ProfileService();

const createUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { profile_name, profile_phone, profile_address, profile_company, profile_position, profile_company_address } = req.body;
        const user_id = new mongoose.Types.ObjectId(req.user.user_id);
        const { message, profile } = await profileService.createUserProfile({
            profile_name,
            profile_phone,
            profile_address,
            profile_company,
            profile_position,
            profile_company_address,
            user_id
        });
        sendJsonResponse(res, 201, message, {profile});
    } catch (error) {
        next(error);
    }
}

export { createUserProfile };