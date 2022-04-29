import express from "express";
import _ from "lodash";
const todoCategoryRouter = express.Router();
import asyncHandler from "express-async-handler";
import { ApiError } from "../handlers/buildError";
import {
  authMiddleware,
  IUserAuthInfoRequest,
} from "../middlewares/authMiddleware";
import permit from "../middlewares/permit";
import TodoCategory from "../models/TodoCategory";

//Create Todo Category
todoCategoryRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    const todoCategory = await TodoCategory.create({
      name: req.body.name,
      color: req.body.color,
      total_count: 0,
      completed_count: 0,
      createdBy: req.user._id,
    });
    res.status(200);
    res.json(todoCategory);
  })
);

// Get all Todo Categories
todoCategoryRouter.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    const todoCategories = await TodoCategory.find({
      createdBy: req.user._id,
    }).sort("createdAt");
    if (!_.isEmpty(todoCategories)) {
      res.status(200).send(todoCategories);
    } else {
      throw ApiError.notFound("No todo categories found.");
    }
  })
);

// Delete todo category
todoCategoryRouter.delete(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    try {
      const filter = { _id: req.params.id, createdBy: req.user._id };
      const todoCategory = await TodoCategory.findOneAndDelete(filter);
      res.status(200);
      res.send(todoCategory);
    } catch (error) {
      res.status(500);
      throw new Error("Server Error");
    }
  })
);

// Update a todo category
todoCategoryRouter.put(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
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
  })
);

// Find a todo category
todoCategoryRouter.get(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    try {
      const filter = { _id: req.params.id, createdBy: req.user._id };
      const data = await TodoCategory.findOne(filter);
      return res.status(200).json(data);
    } catch (error) {
      res.status(500);
      throw new Error("Server Error");
    }
  })
);

export default todoCategoryRouter;
