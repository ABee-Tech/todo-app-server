import express, { Response } from "express";
import _ from "lodash";
import asyncHandler from "express-async-handler";
import { ApiError } from "../handlers/buildError";
import {
  authMiddleware,
  IUserAuthInfoRequest,
} from "../middlewares/authMiddleware";
import permit from "../middlewares/permit";
import TodoCategory from "../models/TodoCategory";
import Todo from "../models/Todo";

const todoCategoryRouter = express.Router();

//Create Todo Category
todoCategoryRouter.post(
  "/",
  authMiddleware,
  asyncHandler(
    async (req: IUserAuthInfoRequest, res: Response): Promise<any> => {
      const todoCategory = await TodoCategory.create({
        name: req.body.name,
        color: req.body.color,
        total_count: 0,
        completed_count: 0,
        createdBy: req.user._id,
      });
      res.status(200);
      res.json(todoCategory);
    }
  )
);

// Get all Todo Categories
todoCategoryRouter.get(
  "/",
  authMiddleware,
  asyncHandler(
    async (req: IUserAuthInfoRequest, res: Response): Promise<any> => {
      const todoCategories = await TodoCategory.find({
        createdBy: req.user._id,
      }).sort("createdAt");
      if (!_.isEmpty(todoCategories)) {
        res.status(200).send(todoCategories);
      } else {
        throw ApiError.notFound("No todo categories found.");
      }
    }
  )
);

// Delete todo category
todoCategoryRouter.delete(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(
    async (req: IUserAuthInfoRequest, res: Response): Promise<any> => {
      const session = await TodoCategory.startSession();
      try {
        session.startTransaction({
          readConcern: { level: "snapshot" },
          writeConcern: { w: "majority" },
        });
        const filter = { _id: req.params.id, createdBy: req.user._id };
        await Todo.deleteMany({ category: req.params.id }, { session });
        const todoCategory = await TodoCategory.findOneAndDelete(filter, {
          session,
        });
        await session.commitTransaction();
        session.endSession();
        res.status(200);
        res.send(todoCategory);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500);
        throw new Error("Server Error");
      }
    }
  )
);

// Update a todo category
todoCategoryRouter.put(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(
    async (req: IUserAuthInfoRequest, res: Response): Promise<any> => {
      try {
        const filter = { _id: req.params.id, createdBy: req.user._id };
        await TodoCategory.findOneAndUpdate(filter, {
          name: req.body.name,
          color: req.body.color,
        });
        const todoCategory = await TodoCategory.findOne(filter);
        res.status(200);
        res.json(todoCategory);
      } catch (error) {
        res.status(500);
        throw new Error("Server Error");
      }
    }
  )
);

// Find a todo category
todoCategoryRouter.get(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(
    async (req: IUserAuthInfoRequest, res: Response): Promise<any> => {
      try {
        const filter = { _id: req.params.id, createdBy: req.user._id };
        const data = await TodoCategory.findOne(filter);
        return res.status(200).json(data);
      } catch (error) {
        res.status(500);
        throw new Error("Server Error");
      }
    }
  )
);

export default todoCategoryRouter;
