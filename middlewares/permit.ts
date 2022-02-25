import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { IUserAuthInfoRequest } from "./authMiddleware";

const permit = asyncHandler(
  async (req: IUserAuthInfoRequest, _res: Response, next: NextFunction) => {
    const { user } = req;
    if (user.role !== "admin") {
      req.user_id = user._id;
    }
    next();
  }
);

export default permit;
