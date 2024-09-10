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

export enum JobStatus {
    OPEN = "open",
    CLOSED = "closed",
}
  
export enum NotificationsStatus {
    UNREAD = "unread",
    READ = "read"
}

export interface Base {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export interface IUser extends Base {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: UserRole;
    profile: Types.ObjectId;
    applied_jobs: Types.ObjectId[];
    posted_jobs: Types.ObjectId[];
    notifications: Types.ObjectId[];
}

export interface IProfile extends Base {
    profile_name: string;
    profile_phone: string;
    profile_address: string;
    profile_resume: string;
    profile_company: string;
    profile_position: string;
    profile_company_address: string;
    user_id: Types.ObjectId;
}

export interface IJob extends Base {
    title: string;
    description: string;
    qualifications: string[]; 
    responsibilities: string[];
    location: string;
    min_salary: number;
    max_salary: number;
    job_type: string;
    status: JobStatus;
    employer_id: Types.ObjectId;
    applications: Types.ObjectId[];
}
  
export interface IJobApplication extends Base {
    job_id: Types.ObjectId;
    job_seeker_id: Types.ObjectId;
    status: JobApplicationStatus;
    cover_letter: string;
    resume: string;
}
  
  
export interface INotification extends Base {
    user_id: Types.ObjectId;
    message: string;
    status: NotificationsStatus;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUserSignUp {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface JwtPayload {
    user_id: string;
    role?: UserRole;
}