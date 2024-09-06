import { Response } from "express";
import { IUser, UserRole } from "../types";

export const sendUser = (user:IUser) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

export const sendLoginResponse = (user:IUser) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    profile: user.profile,
    ...(user.role === UserRole.EMPLOYER && { posted_jobs: user.posted_jobs }),
    ...(user.role === UserRole.JOB_SEEKER && { applied_jobs: user.applied_jobs }),
    notifications: user.notifications,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    deleted_at: user.deletedAt
  };
};

export const sendJsonResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
  accessToken?: string,
) => {
  const responsePayload: any = {
    status: "success",
    message,
    status_code: statusCode,
    data,
  };

  if (accessToken) {
    responsePayload.access_token = accessToken;
  }

  res.status(statusCode).json(responsePayload);
};