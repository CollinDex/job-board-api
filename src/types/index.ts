import { Types } from "mongoose";

export enum UserRole {
    JOB_SEEKER = "job_seeker",    
    EMPLOYER = "employer",
    USER = "user",
    ADMIN = "admin"
  }
  
export enum JobApplicationStatus {
    APPLIED = "applied",
    REVIEWED = "reviewed",
    INTERVIEW = "interview",
    HIRED = "hired",
    REJECTED = "rejected",
  }
  
export enum NotificationsStatus {
    UNREAD = "unread",
    READ = "read"
}

export interface IUser {
    username: string;
    password: string;
    email: string;
    role: UserRole;
    profile: Types.ObjectId;
    applied_jobs: Types.ObjectId[];
    posted_jobs: Types.ObjectId[];
    notifications: Types.ObjectId[];
}

export interface IProfile {
    profile_name: string;
    profile_phone: string;
    profile_address: string;
    profile_resume: string;
    profile_company: string;
    profile_position: string;
    user_id: Types.ObjectId;
}

export interface IJob {
    title: string;
    description: string;
    qualifications: string[]; 
    responsibilities: string[];
    location: string;
    salary_range: string;
    job_type: string;
    employer_id: Types.ObjectId;
    applications: Types.ObjectId[];
}
  
export interface IJobApplication {
    job_id: Types.ObjectId;
    job_seeker_id: Types.ObjectId;
    status: JobApplicationStatus;
    cover_letter: string;
    resume: string;
}
  
  
export interface INotification {
    user_id: Types.ObjectId;
    message: string;
    status: NotificationsStatus;
}