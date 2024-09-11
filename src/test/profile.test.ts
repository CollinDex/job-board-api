import { ProfileService } from '../services';
import { Profile, User } from '../models';
import { Conflict, ResourceNotFound, HttpError } from '../middleware';
import { Types } from 'mongoose';
import { uploadToMega } from '../middleware/uploadfile';

jest.mock('../models');
jest.mock('../middleware/uploadfile');

const profileService = new ProfileService();

describe('ProfileService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUserProfile', () => {
        it('should create a user profile successfully', async () => {
            const payload = { user_id: new Types.ObjectId(), name: 'John Doe' };
            const savedProfile = { _id: new Types.ObjectId(), ...payload };
            
            (Profile.findOne as jest.Mock).mockResolvedValue(null);
            (Profile.prototype.save as jest.Mock).mockResolvedValue(savedProfile);
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);

            const result = await profileService.createUserProfile(payload);

            expect(Profile.findOne).toHaveBeenCalledWith({ user_id: payload.user_id });
            expect(Profile.prototype.save).toHaveBeenCalled();
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                payload.user_id,
                { profile: savedProfile._id },
                { new: true }
            );
            expect(result).toEqual({
                message: 'Profile Created Succesfully',
                profile: savedProfile
            });
        });

        it('should throw Conflict error if the profile already exists', async () => {
            const payload = { user_id: new Types.ObjectId() };
            (Profile.findOne as jest.Mock).mockResolvedValue(true);

            await expect(profileService.createUserProfile(payload))
                .rejects
                .toThrow(new Conflict('User has already created a Profile'));

            expect(Profile.findOne).toHaveBeenCalledWith({ user_id: payload.user_id });
        });
    });

    describe('getUserProfile', () => {
        it('should fetch user profile successfully', async () => {
          const user_id = new Types.ObjectId();
          const profileData = { profile: { _id: new Types.ObjectId() } };
          
          const mockUser = {
              populate: jest.fn().mockResolvedValue(profileData),
          };
      
          (User.findOne as jest.Mock).mockReturnValue(mockUser);
      
          const result = await profileService.getUserProfile(user_id);
      
          expect(User.findOne).toHaveBeenCalledWith({ _id: user_id });
          expect(mockUser.populate).toHaveBeenCalledWith('profile');
          expect(result).toEqual({
              message: 'Profile Fetch Succesfully',
              profile: profileData.profile,
          });
      });
    

        it('should throw ResourceNotFound error if the profile does not exist', async () => {
          const user_id = new Types.ObjectId();

          const mockUser = {
              populate: jest.fn().mockResolvedValue(null),
          };
      
          (User.findOne as jest.Mock).mockReturnValue(mockUser);
      
          await expect(profileService.getUserProfile(user_id))
              .rejects
              .toThrow(new ResourceNotFound('User Profile not Found'));
      
          expect(User.findOne).toHaveBeenCalledWith({ _id: user_id });
          expect(mockUser.populate).toHaveBeenCalledWith('profile');
      });    
    });

    describe('uploadResume', () => {
        it('should upload resume successfully', async () => {
            const user_id = new Types.ObjectId();
            const filePath = '/path/to/file';
            const filename = 'resume.pdf';
            const resumeLink = 'https://mega.nz/file';

            const userProfile = { _id: new Types.ObjectId(), user_id };
            const updatedProfile = { ...userProfile, profile_resume: resumeLink };

            (Profile.findOne as jest.Mock).mockResolvedValue(userProfile);
            (uploadToMega as jest.Mock).mockResolvedValue(resumeLink);
            (Profile.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProfile);

            const result = await profileService.uploadResume(user_id, filePath, filename);

            expect(Profile.findOne).toHaveBeenCalledWith({ user_id });
            expect(uploadToMega).toHaveBeenCalledWith(filePath, filename);
            expect(Profile.findByIdAndUpdate).toHaveBeenCalledWith(userProfile._id, { profile_resume: resumeLink }, { new: true });
            expect(result).toEqual({
                message: 'Resume Upload Succesful',
                profile: updatedProfile
            });
        });

        it('should throw Conflict error if the profile does not exist', async () => {
            const user_id = new Types.ObjectId();
            (Profile.findOne as jest.Mock).mockResolvedValue(null);

            await expect(profileService.uploadResume(user_id, 'filePath', 'filename'))
                .rejects
                .toThrow(new Conflict('User Profile Not Found'));

            expect(Profile.findOne).toHaveBeenCalledWith({ user_id });
        });
    });

    describe('updateUserProfile', () => {
      it('should update the user profile successfully', async () => {
        const user_id = new Types.ObjectId();
        const payload = { 
            user_id, 
            profile_name: 'John Doe Updated', 
            profile_phone: '123456789', 
            profile_address: '123 Main St', 
            profile_resume: 'resume_link', 
            profile_company: 'Company', 
            profile_position: 'Developer', 
            profile_company_address: 'Company Address' 
        };
    
        const profileExists = {
            _id: new Types.ObjectId(),
            ...payload,
        };
    
        const updatedProfile = {
            _id: profileExists._id,
            ...payload,
        };
    
        // Mock the database calls
        (Profile.findOne as jest.Mock).mockResolvedValue(profileExists);
        (Profile.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProfile);
        
        // Mock User.findByIdAndUpdate and print arguments for debugging
        (User.findByIdAndUpdate as jest.Mock).mockImplementation((id, update, options) => {
            console.log("Called with:", id, update, options);
            return Promise.resolve({
              user_id: user_id,
                _id: updatedProfile._id 
            });
        });
    
        const result = await profileService.updateUserProfile(payload);
    
        expect(result).toEqual({
            message: 'Profile Updated Succesfully',
            profile: {
              _id: updatedProfile._id,
              user_id: updatedProfile.user_id
            },
        });
    });    

        it('should throw Resource not found error if the profile does not exist', async () => {
            const payload = { user_id: new Types.ObjectId(), name: 'John Doe' };
            (Profile.findOne as jest.Mock).mockResolvedValue(null);

            await expect(profileService.updateUserProfile(payload))
                .rejects
                .toThrow(new Conflict('User Profile not found'));

            expect(Profile.findOne).toHaveBeenCalledWith({ user_id: payload.user_id });
        });
    });

    describe('deleteUserProfile', () => {
        it('should delete the user profile successfully', async () => {
            const user_id = new Types.ObjectId();
            const profile = { _id: new Types.ObjectId(), user_id };

            (Profile.findOneAndDelete as jest.Mock).mockResolvedValue(profile);
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);

            const result = await profileService.deleteUserProfile(user_id);

            expect(Profile.findOneAndDelete).toHaveBeenCalledWith({ user_id });
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(user_id, { profile: null }, { new: true });
            expect(result).toEqual({ message: 'Profile Deleted Successfully' });
        });

        it('should throw HttpError if profile is not found', async () => {
            const user_id = new Types.ObjectId();
            (Profile.findOneAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(profileService.deleteUserProfile(user_id))
                .rejects
                .toThrow(new HttpError(404, 'Profile not found'));

            expect(Profile.findOneAndDelete).toHaveBeenCalledWith({ user_id });
        });
    });
});


/* // @ts-nocheck
import sinon from "sinon";
import { ProfileService } from "../services/profile.service";
import { Profile, User } from "../models";
import { Conflict, HttpError } from "../middleware";
import mongoose from "mongoose";

describe("ProfileService", () => {
  let profileService: ProfileService;
  let findOneStub: sinon.SinonStub;
  let saveStub: sinon.SinonStub;
  let findByIdAndUpdateStub: sinon.SinonStub;
  let sandbox: sinon.SinonSandbox;

  const mockPayload = {
    user_id: new mongoose.Types.ObjectId("66db88e70e4737e7e20c7db1"),
    profile_name: "John Doe",
    profile_phone: "123456789",
    profile_address: "123 Main St",
    profile_resume: "resume.pdf",
    profile_company: "Company",
    profile_position: "Developer"
  };

  const mockSavedProfile = {
    _id: new mongoose.Types.ObjectId("66db88e70e4737e7e20c7db2"),
    ...mockPayload
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    profileService = new ProfileService();

    findOneStub = sandbox.stub(Profile, "findOne");
    saveStub = sandbox.stub(Profile.prototype, "save");
    findByIdAndUpdateStub = sandbox.stub(User, "findByIdAndUpdate");
    findUserStub = sandbox.stub(User, "findOne");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a user profile successfully", async () => {
    findOneStub.resolves(null); // No existing profile
    saveStub.resolves(mockSavedProfile); // Mock saving profile
    findByIdAndUpdateStub.resolves({}); // Mock updating user

    const result = await profileService.createUserProfile(mockPayload);

    expect(result).toEqual({
      message: "Profile Created Succesfully",
      profile: mockSavedProfile,
    });

    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledOnce(saveStub);
    sinon.assert.calledOnce(findByIdAndUpdateStub);
  });

  it("should throw a Conflict error if the user has already created a profile", async () => {
    findOneStub.resolves(mockSavedProfile); // Mock existing profile

    await expect(
      profileService.createUserProfile(mockPayload)
    ).rejects.toThrow(Conflict);

    sinon.assert.notCalled(saveStub);
    sinon.assert.notCalled(findByIdAndUpdateStub);
  });

  it("should throw an HttpError for an unknown error", async () => {
    findOneStub.rejects(new Error("Unknown error"));

    await expect(
      profileService.createUserProfile(mockPayload)
    ).rejects.toThrow(HttpError);

    sinon.assert.notCalled(saveStub);
    sinon.assert.notCalled(findByIdAndUpdateStub);
  });

  it("should get a user profile successfully", async () => {
    findOneStub.resolves(null); 
    saveStub.resolves(mockSavedProfile); 
    findByIdAndUpdateStub.resolves({}); 
    const result = await profileService.createUserProfile(mockPayload);

    expect(result).toEqual({
      message: "Profile Created Succesfully",
      profile: mockSavedProfile,
    });

    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledOnce(saveStub);
    sinon.assert.calledOnce(findByIdAndUpdateStub);
  });
}); */