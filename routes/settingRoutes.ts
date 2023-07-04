import express, { Response } from "express";
import _ from "lodash";
import asyncHandler from "express-async-handler";
import { ApiError } from "../handlers/buildError";
import {
  authMiddleware,
  IUserAuthInfoRequest,
} from "../middlewares/authMiddleware";
import permit from "../middlewares/permit";
import Setting from "../models/Setting";

const settingRouter = express.Router();

settingRouter.get(
  "/",
  authMiddleware,
  asyncHandler(
    async (req: IUserAuthInfoRequest, res: Response): Promise<any> => {
      let settings = await Setting.findOne({
        userId: req.user._id,
      });
      if (!_.isEmpty(settings)) {
        res.status(200);
        res.send(settings);
      } else {
        throw ApiError.notFound("No settings found.");
      }
    }
  )
);

// Update Setting
settingRouter.put(
  "/",
  authMiddleware,
  permit,
  asyncHandler(
    async (req: IUserAuthInfoRequest, res: Response): Promise<any> => {
      const { theme } = req.body;
      const session = await Setting.startSession();
      session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      });
      const filter = { userId: req.user._id };
      const prevSettings = await Setting.findOne(filter);

      if (prevSettings) {
        await Setting.findOneAndUpdate(filter, { theme }, { session });
      } else {
        await Setting.create([{ theme, userId: req.user._id }], { session });
      }
      await session.commitTransaction();
      session.endSession();
      const setting = await Setting.findOne(filter);
      res.status(200);
      res.json(setting);
    }
  )
);

export default settingRouter;
