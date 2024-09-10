import { z } from "zod";

const employerProfileSchema = z.object({
  profile_name: z.string().min(1, { message: "name cannot be empty" }),
  profile_phone: z.string().min(1, { message: "Phone number cannot be empty" }),
  profile_address: z.string().min(1, { message: "Address cannot be empty" }),
  profile_company: z.string().min(1, { message: "Company cannot be empty" }),
  profile_position: z.string().min(1, { message: "Position cannot be empty" }),
  profile_company_address: z.string().min(1, { message: "Company Address cannot be empty" }), 
});

const jobSeekerProfileSchema = z.object({
    profile_name: z.string().min(1, { message: "name cannot be empty" }),
    profile_phone: z.string().min(1, { message: "Phone number cannot be empty" }),
    profile_address: z.string().min(1, { message: "Address cannot be empty" }), 
});

const profileSchema = z.object({
  profile_name: z.string().min(1, { message: "name cannot be empty" }).optional(),
  profile_phone: z.string().min(1, { message: "Phone number cannot be empty" }).optional(),
  profile_address: z.string().min(1, { message: "Address cannot be empty" }).optional(),
  profile_company: z.string().min(1, { message: "Company cannot be empty" }).optional(),
  profile_position: z.string().min(1, { message: "Position cannot be empty" }).optional(),
  profile_company_address: z.string().min(1, { message: "Company Address cannot be empty" }).optional(), 
});


export { employerProfileSchema, jobSeekerProfileSchema, profileSchema };
