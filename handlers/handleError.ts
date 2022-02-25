import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger";
import { ApiError } from "./buildError";

const apiErrorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  Logger.log("error", err.stack);

  if (err instanceof ApiError) {
    res.status(err.code).json({ status: err.code, message: err.message });
    return;
  }
  res.status(500).json({ status: 500, message: "Internal Server Error" });
};

export default apiErrorHandler;
