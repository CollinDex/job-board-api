import jwt from "jsonwebtoken";
import config from "../config";
import { Conflict, HttpError } from "../middleware";
import { User } from "../models";
import { IUserLogin, IUserSignUp, IUser } from "../types";
import { comparePassword, hashPassword } from "../utils";
import { sendLoginResponse, sendUser } from "../utils/send-response";

export class AuthService {
    public async signUp(payload: IUserSignUp): Promise <{
        message: string;
        user: Partial<IUser>;
        access_token: string;
    }> {
        const { username, email, password, role} = payload;
        
        try {
            const userExists = await User.findOne({ email: email });

            if (userExists) {
                if (userExists.deletedAt) {
                  throw new HttpError(
                    403,
                    "Account associated with these email has been deleted. Please contact support for assistance.",
                  );
                }
                throw new Conflict("User already exists");
            } 
              
            const hashedPassword = await hashPassword(password);
            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                role: role
            });

            const createdUser = await user.save();
            
            const access_token = jwt.sign(
                { user_id: createdUser._id },
                config.TOKEN_SECRET,
                {
                    expiresIn: config.TOKEN_EXPIRY,
                },
            );

            const userResponse = sendUser(user);

            return {
                user: userResponse,
                access_token,
                message: "User Created Successfully",
            };

        } catch (error) {
            if (error instanceof HttpError) {
              throw error;
            }
            throw new HttpError(error.status || 500, error.message || error);
          }
    }

    public async signIn(
        payload: IUserLogin,
      ): Promise<{ message: string; user: Partial<IUser>; access_token: string }> {
        const { email, password } = payload;
    
        try {
          const user = await User.findOne({
            email: email
          });
    
          if (!user) {
            throw new HttpError(401, "Invalid credentials");
          }

          const isPasswordValid = await comparePassword(password, user.password);

          if (!isPasswordValid) {
            throw new HttpError(401, "Invalid credentials");
          }
    
          const access_token = jwt.sign({ user_id: user._id }, config.TOKEN_SECRET, {
            expiresIn: config.TOKEN_EXPIRY,
          });
    
          const userResponse = sendLoginResponse(user);
    
          return {
            user: userResponse,
            access_token,
            message: "Login successful",
          };
        } catch (error) {
          if (error instanceof HttpError) {
            throw error;
          }
          throw new HttpError(error.status || 500, error.message || error);
        }
      }
}