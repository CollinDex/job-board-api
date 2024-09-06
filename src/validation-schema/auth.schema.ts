import { z } from "zod";
import { UserRole } from "../types";

const signUpSchema = z.object({
  username: z.string().min(1, { message: "username cannot be empty" }),
  email: z.string().min(1, { message: "Email cannot be empty" }).email({message: "input a valid email"}),
  role: z.enum([UserRole.EMPLOYER, UserRole.JOB_SEEKER]).optional(),
  password: z.string().min(1, { message: "password cannot be empty" }), 
});

const signInSchema = z.object({
    email: z.string().min(1, { message: "Email cannot be empty" }).email({message: "input a valid email"}),
    password: z.string().min(1, { message: "password cannot be empty" }), 
  });

export { signUpSchema, signInSchema };
