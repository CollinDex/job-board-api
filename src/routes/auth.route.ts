import { Router } from "express";
import { signUp, signIn } from "../controllers";
import { validateData } from "../middleware/validationMiddleware";
import { signInSchema, signUpSchema } from "../validation-schema/auth.schema";

const authRoute = Router();

authRoute.post("/auth/signUp", validateData(signUpSchema), signUp);
authRoute.post("/auth/signIn", validateData(signInSchema), signIn);

export { authRoute };
