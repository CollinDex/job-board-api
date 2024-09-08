import { Profile, User } from "../models";
import { IProfile } from "../types";
import { Conflict, HttpError, ResourceNotFound } from "../middleware";
import { Types } from "mongoose";

//Profile Service
//Update User Profile
//Delete User Profile
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

            if (profile!) {
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
};