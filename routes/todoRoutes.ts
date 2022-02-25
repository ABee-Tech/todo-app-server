import express from "express";
const todoRouter = express.Router();
import asyncHandler from "express-async-handler";
import {
  authMiddleware,
  IUserAuthInfoRequest,
} from "../middlewares/authMiddleware";
import permit from "../middlewares/permit";
import Todo from "../models/Todo";

//Create Todo
todoRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    try {
      const { title, category } = req.body;
      const todo = await Todo.create({
        title,
        category,
        createdBy: req.user._id,
      });
      const populatedTodo = await Todo.findById(todo._id).populate("category");
      res.status(200);
      res.json(populatedTodo);
    } catch (error) {
      res.status(500);
      throw new Error(error);
    }
  })
);

todoRouter.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    let todos = await Todo.find({ createdBy: req.user._id })
      .sort("createdAt")
      .populate("category");

    if (todos) {
      res.status(201);
      res.send(todos);
    } else {
      res.status(401);
      throw new Error("Server error");
    }
  })
);

//Delete todo

todoRouter.delete(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    try {
      const filter = { _id: req.params.id, createdBy: req.user._id };
      const todo = await Todo.findOneAndDelete(filter);
      res.status(200);
      res.send(todo);
    } catch (error) {
      res.status(500);
      throw new Error("Server Error");
    }
  })
);

// Mark complete or incomplete Todo
todoRouter.put(
  "/:id/completed",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    try {
      const filter = { _id: req.params.id, createdBy: req.user._id };
      await Todo.findOneAndUpdate(filter, { completed: req.body.completed });
      const todo = await Todo.findOne(filter).populate("category");
      res.status(200);
      res.json(todo);
    } catch (error) {
      res.status(500);
      throw new Error("Update failed");
    }
  })
);

// Update Todo
todoRouter.put(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    try {
      const filter = { _id: req.params.id, createdBy: req.user._id };
      await Todo.findOneAndUpdate(filter, req.body);
      const todo = await Todo.findOne(filter).populate("category");
      res.status(200);
      res.json(todo);
    } catch (error) {
      res.status(500);
      throw new Error("Update failed");
    }
  })
);

//find a todo
todoRouter.get(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    try {
      const filter = { _id: req.params.id, createdBy: req.user._id };
      const data = await Todo.findOne(filter).populate("category");
      return res.status(200).json(data);
    } catch (error) {
      res.status(500);
      throw new Error("No todo found");
    }
  })
);

export default todoRouter;
