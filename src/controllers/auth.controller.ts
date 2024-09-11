import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { sendJsonResponse } from "../utils/send-response";

const authService = new AuthService();

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, access_token, message } = await authService.signUp(req.body);
        sendJsonResponse(res, 201, message, { user, access_token });   
    } catch (error) {
        next(error);
    }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, access_token, message } = await authService.signIn(req.body);
        sendJsonResponse(res, 200, message, { user, access_token });   
    } catch (error) {
        next(error);
    }
};

export { signUp, signIn };