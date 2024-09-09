import { Profile, User } from "../models";
import { IProfile } from "../types";
import { Conflict, HttpError, ResourceNotFound } from "../middleware";
import { Types } from "mongoose";
import { uploadToMega } from "../middleware/uploadfile";

export class ProfileService {
    public async createUserProfile (payload:Partial<IProfile>): Promise<{message: string, profile: IProfile}> {
        try {
            const { user_id } = payload;
            const profileExists = await Profile.findOne({user_id: user_id});
            
            if (profileExists) {
                throw new Conflict("User has already created a Profile");
            };

            const profile = new Profile(payload);

            const savedProfile = await profile.save();

            await User.findByIdAndUpdate(
                user_id,
                {profile: savedProfile._id},
                {new: true}
            );
        
            return {
                message: "Profile Created Succesfully",
                profile: savedProfile
            }
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    }

    public async getUserProfile (user_id: Types.ObjectId): Promise<{message: string, profile: Types.ObjectId}> {
        try {
            const profile = await User.findOne({_id:user_id}).populate('profile');

            if (!profile || (profile.profile === null)) {
                throw new ResourceNotFound("User Profile not Found");
            };
            
            return {
                message: "Profile Fetch Succesfully",
                profile: profile.profile
            }
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    }

    public async uploadResume (user_id: Types.ObjectId, filePath:string, filename: string): Promise <{
        message: string;
        profile: IProfile;
    }> {
        try {

            const userProfile = await Profile.findOne({ user_id: user_id });

            if(!userProfile) {
                throw new Conflict("User Profile Not Found");
            }
    
            const resume = await uploadToMega(filePath, filename);

            const updatedProfile = await Profile.findByIdAndUpdate(userProfile._id, {profile_resume: resume},{new: true});

            return {
                message: "Resume Upload Succesful",
                profile: updatedProfile
            }
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    }

    public async updateUserProfile (payload:Partial<IProfile>): Promise<{message: string, profile: IProfile}> {
        try {
            const { user_id } = payload;
            const profileExists = await Profile.findOne({user_id: user_id});
            
            if (!profileExists) {
                throw new Conflict("User Profile not found");
            };

            const updatedProfile = await Profile.findByIdAndUpdate(
                profileExists._id,
                payload,
                {new: true}
            );

            await User.findByIdAndUpdate(
                user_id,
                {profile: updatedProfile._id},
                {new: true}
            );
        
            return {
                message: "Profile Updated Succesfully",
                profile: updatedProfile
            }
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    }

    public async deleteUserProfile (user_id: Types.ObjectId): Promise<{message: string}> {
        try {

            const profile = await Profile.findOneAndDelete({ user_id });

            if (!profile) {
                throw new HttpError(404, "Profile not found");
            }

            await User.findByIdAndUpdate(user_id, { profile: null }, { new: true });
            
            return {
                message: "Profile Deleted Successfully"
            };
              
        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
        }
    }
};