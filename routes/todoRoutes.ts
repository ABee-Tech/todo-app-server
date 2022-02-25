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
      const todo = await Todo.create({ ...req.body, createdBy: req.user._id });
      res.status(200);
      res.json(todo);
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
    let todos = await Todo.find({ createdBy: req?.user?._id }).sort(
      "createdAt"
    );

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
  asyncHandler(async (req, res): Promise<any> => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
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
  asyncHandler(async (req, res): Promise<any> => {
    try {
      await Todo.findByIdAndUpdate(req.params.id, req.body);
      const todo = await Todo.findById(req.params.id);
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
  asyncHandler(async (req, res): Promise<any> => {
    try {
      await Todo.findByIdAndUpdate(req.params.id, req.body);
      const todo = await Todo.findById(req.params.id);
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
  asyncHandler(async (req, res): Promise<any> => {
    try {
      const data = await Todo.findById(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      res.status(500);
      throw new Error("No todo found");
    }
  })
);

export default todoRouter;
