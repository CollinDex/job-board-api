import { Types } from "mongoose";

enum user_role_enum {
    job_seeker = "job_seeker",    
    employer = "employer",
    admin = "admin"
  }
  
enum job_application_status_enum {
    applied = "Applied",
    reviewed = "Reviewed",
    interview = "Interview",
    hired = "Hired",
    rejected = "Rejected",
  }
  
enum notifications_status_enum {
    unread = "Unread",
    read = "Read"
}

interface IUser {
    username: string;
    password: string;
    email: string;
    role: user_role_enum;
    profile_name: string;
    profile_phone: string;
    profile_address: string;
    profile_resume: string;
    profile_company: string;
    profile_position: string;
    applied_jobs: Types.ObjectId;
    posted_jobs: Types.ObjectId;
}
  