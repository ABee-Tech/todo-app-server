import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { ApiError } from "../handlers/buildError";

export interface IUserAuthInfoRequest extends Request {
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  user_id?: string;
}

export const authMiddleware = asyncHandler(
  async (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded != "string" && decoded.id) {
          const user = await User.findById(decoded.id);
          req.user = user;
          next();
        } else {
          throw new ApiError(401, "Not authorised, token is fake");
        }
      } catch (error) {
        res.status(401);
        throw new ApiError(401, "Not authorised, token is fake");
      }
    }

    if (!token) {
      throw new ApiError(401, "Not authorised, no token");
    }
  }
);