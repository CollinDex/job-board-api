import sinon from "sinon";
import { JobApplicationService } from "../services/job-application.service";
import { JobApplication } from "../models";
import mongoose from "mongoose";
import { Conflict, HttpError } from "../middleware";

describe("JobApplicationService", () => {
  let jobApplicationService: JobApplicationService;
  let findOneStub: sinon.SinonStub;
  let saveStub: sinon.SinonStub;
  let sandbox: sinon.SinonSandbox;
  
  const mockPayload = {
    job_id: new mongoose.Types.ObjectId("66db88e70e4737e7e20c7db1"),
    job_seeker_id: new mongoose.Types.ObjectId("66db88e70e4737e7e20c7db1"),
    cover_letter: "Cover letter text",
  };

  const mockSavedApplication = {
    _id: "app123",
    ...mockPayload,
    resume: "https://mega.co.nz/fake_resume_link",
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    jobApplicationService = new JobApplicationService();

    // Stubbing external dependencies
    findOneStub = sandbox.stub(JobApplication, "findOne");
    saveStub = sandbox.stub(JobApplication.prototype, "save");
  });

  afterEach(() => {
    sandbox.restore(); // Restore the sandbox to avoid side effects between tests
  });

/*   it("should apply for a job successfully", async () => {
    // Simulating a scenario where no existing application is found
    findOneStub.resolves(null);
    saveStub.resolves(mockSavedApplication); // Simulate successful save

    const result = await jobApplicationService.applyForJob(
      mockPayload,
      "path/to/resume.pdf",
      "resume.pdf"
    );

    // Assert the expected outcome
    expect(result).toEqual({
      message: "Job Application Succesful",
      jobApplication: mockSavedApplication,
    });

    sinon.assert.calledOnce(findOneStub); // Ensure findOne was called once
    sinon.assert.calledOnce(saveStub); // Ensure save was called once
  }); */

  it("should throw a Conflict error if the user has already applied for the job", async () => {
    // Simulating an existing application
    findOneStub.resolves(mockSavedApplication);

    await expect(
      jobApplicationService.applyForJob(
        mockPayload,
        "path/to/resume.pdf",
        "resume.pdf"
      )
    ).rejects.toThrow(Conflict); // Ensure the Conflict error is thrown

    sinon.assert.calledOnce(findOneStub); // Ensure findOne was called once
    sinon.assert.notCalled(saveStub); // Ensure save was not called
  });

  it("should throw an HttpError for an unknown error", async () => {
    // Simulating an unexpected error
    findOneStub.rejects(new Error("Unknown error"));

    await expect(
      jobApplicationService.applyForJob(
        mockPayload,
        "path/to/resume.pdf",
        "resume.pdf"
      )
    ).rejects.toThrow(HttpError); // Ensure HttpError is thrown

    sinon.assert.calledOnce(findOneStub); // Ensure findOne was called once
    sinon.assert.notCalled(saveStub); // Ensure save was not called
  });
});
