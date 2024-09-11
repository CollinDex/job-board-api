// @ts-nocheck
import { AuthService } from '../services';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import { Conflict, HttpError } from '../middleware';
import { comparePassword, hashPassword } from '../utils';
import { sendLoginResponse, sendUser } from '../utils/send-response';

// Mock the dependencies
jest.mock('../models');
jest.mock('jsonwebtoken');
jest.mock('../utils');
jest.mock('../utils/send-response');

const mockUser = User as jest.Mocked<typeof User>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockComparePassword = comparePassword as jest.MockedFunction<typeof comparePassword>;
const mockSendUser = sendUser as jest.MockedFunction<typeof sendUser>;
const mockSendLoginResponse = sendLoginResponse as jest.MockedFunction<typeof sendLoginResponse>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      const payload = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      };

      const savedUser = { ...payload, _id: 'userId123', password: 'hashedPassword' };

      // Mock User.findOne to return null (no user exists)
      mockUser.findOne.mockResolvedValue(null);

      // Mock hashPassword to return a hashed password
      mockHashPassword.mockResolvedValue('hashedPassword');

      // Mock user.save to return saved user
      mockUser.prototype.save.mockResolvedValue(savedUser as any);

      // Mock jwt.sign to return a token
      mockJwt.sign.mockReturnValue('accessToken');

      // Mock sendUser utility to format user response
      mockSendUser.mockReturnValue({ username: 'john_doe', email: 'john@example.com' });

      const result = await authService.signUp(payload);

      // Assertions
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: payload.email });
      expect(mockHashPassword).toHaveBeenCalledWith(payload.password);
      expect(mockUser.prototype.save).toHaveBeenCalled();
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { user_id: savedUser._id },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(result).toEqual({
        user: { username: 'john_doe', email: 'john@example.com' },
        access_token: 'accessToken',
        message: 'User Created Succesfully',
      });
    });

    it('should throw Conflict error if user already exists', async () => {
      const payload = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      };

      // Mock User.findOne to return an existing user
      mockUser.findOne.mockResolvedValue({ email: payload.email });

      await expect(authService.signUp(payload))
        .rejects
        .toThrow(new Conflict('User already exists'));

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: payload.email });
    });

    it('should throw HttpError if the account is deleted', async () => {
      const payload = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      };

      // Mock User.findOne to return a deleted user
      mockUser.findOne.mockResolvedValue({ email: payload.email, deletedAt: new Date() });

      await expect(authService.signUp(payload))
        .rejects
        .toThrow(new HttpError(403, 'Account associated with these email has been deleted. Please contact support for assistance.'));

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: payload.email });
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const payload = { email: 'john@example.com', password: 'password123' };
      const user = { _id: 'userId123', email: 'john@example.com', password: 'hashedPassword' };

      // Mock User.findOne to return a user
      mockUser.findOne.mockResolvedValue(user);

      // Mock comparePassword to return true
      mockComparePassword.mockResolvedValue(true);

      // Mock jwt.sign to return a token
      mockJwt.sign.mockReturnValue('accessToken');

      // Mock sendLoginResponse utility to format user response
      mockSendLoginResponse.mockReturnValue({ username: 'john_doe', email: 'john@example.com' });

      const result = await authService.signIn(payload);

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: payload.email });
      expect(mockComparePassword).toHaveBeenCalledWith(payload.password, user.password);
      expect(mockJwt.sign).toHaveBeenCalledWith({ user_id: user._id }, expect.any(String), {
        expiresIn: expect.any(String),
      });
      expect(result).toEqual({
        user: { username: 'john_doe', email: 'john@example.com' },
        access_token: 'accessToken',
        message: 'Login successful',
      });
    });

    it('should throw HttpError if user is not found', async () => {
      const payload = { email: 'john@example.com', password: 'password123' };

      // Mock User.findOne to return null
      mockUser.findOne.mockResolvedValue(null);

      await expect(authService.signIn(payload))
        .rejects
        .toThrow(new HttpError(401, 'Invalid credentials'));

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: payload.email });
    });

    it('should throw HttpError if password is incorrect', async () => {
      const payload = { email: 'john@example.com', password: 'password123' };
      const user = { _id: 'userId123', email: 'john@example.com', password: 'hashedPassword' };

      // Mock User.findOne to return a user
      mockUser.findOne.mockResolvedValue(user);

      // Mock comparePassword to return false (incorrect password)
      mockComparePassword.mockResolvedValue(false);

      await expect(authService.signIn(payload))
        .rejects
        .toThrow(new HttpError(401, 'Invalid credentials'));

      expect(mockComparePassword).toHaveBeenCalledWith(payload.password, user.password);
    });
  });
});