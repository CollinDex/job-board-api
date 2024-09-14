import { NextFunction, Request, Response } from "express";
import log from "../utils/logger";
import { ServerError } from "./error";
import { UserRole } from "../types";


export const checkRole = (
  role: UserRole
) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      log.error("Invalid token: No user attached to the request");
      return res.status(401).json({
        status_code: "401",
        message: "Invalid token",
      });
    }

    if (req.user.role !== role) {
      log.warn(`Access forbidden: User role ${req.user.role} does not match required role ${role}`);
      return res.status(403).json({
        status_code: "403",
        message: `Access forbidden: User role ${req.user.role} does not match required role ${role}`,
      });
    }

    next(); // Do not return here in async functions
  } catch (error) {
    log.error(error);
    next(new ServerError("INTERNAL_SERVER_ERROR")); // Properly pass error to next()
  }
};
