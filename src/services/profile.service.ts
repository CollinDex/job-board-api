import { Profile, User } from "../models";
import { IProfile } from "../types";
import { Conflict, HttpError } from "../middleware";

//Profile Service
//Update User Profile
//Delete User Profile
//Get User Profile
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
};