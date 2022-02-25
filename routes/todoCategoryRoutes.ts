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
        ...req.body,
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
      res.status(401);
      throw new Error("Server error");
    }
  })
);

// Delete todo category
todoCategoryRouter.delete(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req, res): Promise<any> => {
    try {
      const todoCategory = await TodoCategory.findByIdAndDelete(req.params.id);
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
  asyncHandler(async (req, res): Promise<any> => {
    try {
      await TodoCategory.findByIdAndUpdate(req.params.id, req.body);
      const todoCategory = await TodoCategory.findById(req.params.id);
      res.status(200);
      res.json(todoCategory);
    } catch (error) {
      res.status(500);
      throw new Error("Update failed");
    }
  })
);

// Find a todo category
todoCategoryRouter.get(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req, res): Promise<any> => {
    try {
      const data = await TodoCategory.findById(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      res.status(500);
      throw new Error("No todo category found");
    }
  })
);

export default todoCategoryRouter;
