import { Schema, SchemaTypes, model } from "mongoose";
import { IUser, UserRole } from "../types";

const userSchema = new Schema<IUser>({
    username: { type: SchemaTypes.String, required: true },
    password: { type: SchemaTypes.String, required: true },
    email: { type: SchemaTypes.String, minlength: 5, required: true, unique: true },
    role: { type: SchemaTypes.String, enum: UserRole, default: UserRole.USER, required: true },
    profile: { type: SchemaTypes.ObjectId, ref: "Profile", required: false },
    applied_jobs: [{ type: SchemaTypes.ObjectId, ref: "JobApplication", required: false }],
    posted_jobs: [{ type: SchemaTypes.ObjectId, ref: "Job", required: false }],
    notifications: [{ type: SchemaTypes.ObjectId, ref: "Notification", required: false }]
    },
    {
        timestamps: true
    }
);

export const User = model<IUser>('User', userSchema);
