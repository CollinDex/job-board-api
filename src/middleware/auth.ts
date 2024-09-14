import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { User } from "../models";
import log from "../utils/logger";
import { ServerError } from "./error";
import { JwtPayload, UserRole } from "../types";

export const authMiddleware = async (
  req: Request & { user?: { user_id: string; role: UserRole } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    //const apiKey = req.headers['x-api-key'];

    /* if (!apiKey || (apiKey !== config.API_KEY)) {
      return res.status(403).json({
        status_code: "403",
        message: "Invalid Api Key",
      });
    } */

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status_code: "401",
        message: "Invalid token",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status_code: "401",
        message: "Invalid token",
      });
    }

    jwt.verify(token, config.TOKEN_SECRET, async (err, decoded) => {
      if (err || !decoded) {
        return res.status(401).json({
          status_code: "401",
          message: "Invalid token",
        });
      }

      const { user_id } = decoded as JwtPayload;
      log.info(`user with id ${user_id} is logged in`);

      const user = await User.findOne({
        _id: user_id
      });

      if (!user) {
        return res.status(401).json({
          status_code: "401",
          message: "Invalid token",
        });
      }

      req.user = {
        user_id: user._id,
        role: user.role,
        email: user.email,
        username: user.username
      };

      next();
    });
  } catch (error) {
    log.error(error);
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
};