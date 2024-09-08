import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services";
import { sendJsonResponse } from "../utils/send-response";
import mongoose from "mongoose";
import { deleteFile } from "../middleware/uploadfile";

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

const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.user_id);
        const { message, profile } = await profileService.getUserProfile(user_id);
        sendJsonResponse(res, 200, message, {profile});
    } catch (error) {
        next(error);
    }
}

const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const user_id = new mongoose.Types.ObjectId(req.user.user_id);
  
      const { message, profile } = await profileService.uploadResume(
        user_id,
        req.file?.path,
        req.file?.filename);

      sendJsonResponse(res, 201, message, { profile });
    } catch (error) {

      if (req.file) {
          await deleteFile(req.file?.path);
      };
      
      next(error);
    }
};

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { profile_name, profile_phone, profile_address, profile_company, profile_position, profile_company_address } = req.body;
        const user_id = new mongoose.Types.ObjectId(req.user.user_id);
        const { message, profile } = await profileService.updateUserProfile({
            profile_name,
            profile_phone,
            profile_address,
            profile_company,
            profile_position,
            profile_company_address,
            user_id
        });
        sendJsonResponse(res, 200, message, {profile});
    } catch (error) {
        next(error);
    }
};

const deleteUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.user_id);
        const { message } = await profileService.deleteUserProfile(user_id);
        sendJsonResponse(res, 204, message );
    } catch (error) {
        next(error);
    }
}

export { createUserProfile, getUserProfile, uploadResume, updateUserProfile, deleteUserProfile };