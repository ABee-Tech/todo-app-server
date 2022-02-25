import express from "express";
const todoCategoryRouter = express.Router();
import asyncHandler from "express-async-handler";
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
    try {
      const todoCategory = await TodoCategory.create({
        name: req.body.name,
        color: req.body.color,
        progress: 0,
        createdBy: req.user._id,
      });
      res.status(200);
      res.json(todoCategory);
    } catch (error) {
      res.status(500);
      throw new Error(error);
    }
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
    if (todoCategories) {
      res.status(201);
      res.send(todoCategories);
    } else {
      res.status(500);
      throw new Error("Server error");
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
