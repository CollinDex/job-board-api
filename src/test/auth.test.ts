// @ts-nocheck
import { AuthService } from '../services';
import { User } from "../models";
import { Conflict, HttpError } from "../middleware";
import { comparePassword, hashPassword } from "../utils";
import { sendLoginResponse, sendUser } from "../utils/send-response";
import config from "../config";
import jwt from 'jsonwebtoken';

// Mock the necessary modules and functions
jest.mock("../models");
jest.mock("../utils", () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));
jest.mock("../utils/send-response", () => ({
  sendLoginResponse: jest.fn(),
  sendUser: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    const payload = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      role: "user",
    };

    it("should create a new user successfully", async () => {
      // Mocking the necessary functions
      (User.findOne as jest.Mock).mockResolvedValue(null);  // No user exists
      (hashPassword as jest.Mock).mockResolvedValue("hashedpassword123"); // Password is hashed
      (User.prototype.save as jest.Mock).mockResolvedValue({
        _id: "1",
        username: payload.username,
        email: payload.email,
        password: "hashedpassword123",
        role: payload.role,
      });
      (jwt.sign as jest.Mock).mockReturnValue("token"); // JWT is generated
      (sendUser as jest.Mock).mockReturnValue({
        id: "1",
        username: payload.username,
        email: payload.email,
      });

      // Act: Call the signUp service
      const result = await authService.signUp(payload);

      // Assert: Ensure the mocks were called and the response matches expectations
      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
      expect(hashPassword).toHaveBeenCalledWith(payload.password);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: "1" },
        config.TOKEN_SECRET,
        { expiresIn: config.TOKEN_EXPIRY }
      );
      expect(result).toEqual({
        user: {
          id: "1",
          username: payload.username,
          email: payload.email,
        },
        access_token: "token",
        message: "User Created Successfully",  // Correcting any typo in the message if necessary
      });
    });

    it("should throw a Conflict error if the user already exists", async () => {
      // Mock user already existing
      (User.findOne as jest.Mock).mockResolvedValue({ email: payload.email });

      await expect(authService.signUp(payload)).rejects.toThrow(Conflict);

      // Assert the right call was made
      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
    });

    it("should throw an HttpError if the account is deleted", async () => {
      // Mock user account with deletion
      (User.findOne as jest.Mock).mockResolvedValue({
        email: payload.email,
        deletedAt: new Date(),
      });

      await expect(authService.signUp(payload)).rejects.toThrow(HttpError);

      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
    });
  });

  describe("signIn", () => {
    const payload = {
      email: "testuser@example.com",
      password: "password123",
    };

    it("should sign in a user successfully", async () => {
      // Mock user and comparePassword
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "1",
        email: payload.email,
        password: "hashedpassword123",
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);  // Password matches
      (jwt.sign as jest.Mock).mockReturnValue("token");
      (sendLoginResponse as jest.Mock).mockReturnValue({
        id: "1",
        email: payload.email,
      });

      const result = await authService.signIn(payload);

      // Assert: Ensure all functions were called properly and the response is correct
      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
      expect(comparePassword).toHaveBeenCalledWith(payload.password, "hashedpassword123");
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: "1" },
        config.TOKEN_SECRET,
        { expiresIn: config.TOKEN_EXPIRY }
      );
      expect(result).toEqual({
        user: {
          id: "1",
          email: payload.email,
        },
        access_token: "token",
        message: "Login successful",
      });
    });

    it("should throw an HttpError if the user does not exist", async () => {
      // Mock user not existing
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.signIn(payload)).rejects.toThrow(HttpError);

      // Assert: Ensure findOne was called correctly
      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
    });

    it("should throw an HttpError if the password is incorrect", async () => {
      // Mock user exists, but incorrect password
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "1",
        email: payload.email,
        password: "hashedpassword123",
      });
      (comparePassword as jest.Mock).mockResolvedValue(false); // Password does not match

      await expect(authService.signIn(payload)).rejects.toThrow(HttpError);

      // Assert: Ensure comparePassword was called with the correct arguments
      expect(comparePassword).toHaveBeenCalledWith(payload.password, "hashedpassword123");
    });

    it("should throw an HttpError if an unexpected error occurs", async () => {
      // Mock unexpected error
      (User.findOne as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

      await expect(authService.signIn(payload)).rejects.toThrow(HttpError);
    });
  });
});



/* import jwt from "jsonwebtoken";
import { AuthService } from "../services/auth.service";
import { User } from "../models";
import { Conflict, HttpError } from "../middleware";
import { comparePassword, hashPassword } from "../utils";
import { sendLoginResponse, sendUser } from "../utils/send-response";
import config from "../config";

// Mock the necessary modules and functions
jest.mock("../models");
jest.mock("../utils", () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));
jest.mock("../utils/send-response", () => ({
  sendLoginResponse: jest.fn(),
  sendUser: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    const payload = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      role: "user",
    };

    it("should create a new user successfully", async () => {
      // Mock the hashPassword, User model, and jwt.sign
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue("hashedpassword123");
      (User.prototype.save as jest.Mock).mockResolvedValue({
        _id: "1",
        username: payload.username,
        email: payload.email,
        password: "hashedpassword123",
        role: payload.role,
      });
      (jwt.sign as jest.Mock).mockReturnValue("token");
      (sendUser as jest.Mock).mockReturnValue({
        id: "1",
        username: payload.username,
        email: payload.email,
      });

      const result = await authService.signUp(payload);

      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
      expect(hashPassword).toHaveBeenCalledWith(payload.password);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: "1" },
        config.TOKEN_SECRET,
        { expiresIn: config.TOKEN_EXPIRY }
      );
      expect(result).toEqual({
        user: {
          id: "1",
          username: payload.username,
          email: payload.email,
        },
        access_token: "token",
        message: "User Created Succesfully",
      });
    });

    it("should throw a Conflict error if the user already exists", async () => {
      // Mock userExists
      (User.findOne as jest.Mock).mockResolvedValue({
        email: payload.email,
      });

      await expect(authService.signUp(payload)).rejects.toThrow(
        Conflict
      );
    });

    it("should throw an HttpError if an unexpected error occurs", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

      await expect(authService.signUp(payload)).rejects.toThrow(HttpError);
    });
  });

  describe("signIn", () => {
    const payload = {
      email: "testuser@example.com",
      password: "password123",
    };

    it("should sign in a user successfully", async () => {
      // Mock user and comparePassword
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "1",
        email: payload.email,
        password: "hashedpassword123",
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");
      (sendLoginResponse as jest.Mock).mockReturnValue({
        id: "1",
        email: payload.email,
      });

      const result = await authService.signIn(payload);

      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
      expect(comparePassword).toHaveBeenCalledWith(
        payload.password,
        "hashedpassword123"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: "1" },
        config.TOKEN_SECRET,
        { expiresIn: config.TOKEN_EXPIRY }
      );
      expect(result).toEqual({
        user: {
          id: "1",
          email: payload.email,
        },
        access_token: "token",
        message: "Login successful",
      });
    });

    it("should throw an HttpError if the user does not exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.signIn(payload)).rejects.toThrow(HttpError);
    });

    it("should throw an HttpError if the password is incorrect", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "1",
        email: payload.email,
        password: "hashedpassword123",
      });
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(payload)).rejects.toThrow(HttpError);
    });

    it("should throw an HttpError if an unexpected error occurs", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

      await expect(authService.signIn(payload)).rejects.toThrow(HttpError);
    });
  });
}); */
