// @ts-nocheck
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
});
