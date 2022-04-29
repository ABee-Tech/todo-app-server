import express from "express";
import _ from "lodash";
const todoRouter = express.Router();
import asyncHandler from "express-async-handler";
import { ApiError } from "../handlers/buildError";
import {
  authMiddleware,
  IUserAuthInfoRequest,
} from "../middlewares/authMiddleware";
import permit from "../middlewares/permit";
import Todo from "../models/Todo";
import TodoCategory from "../models/TodoCategory";

//Create Todo
todoRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    const session = await Todo.startSession();
    session.startTransaction();
    const { title, category } = req.body;
    const todo = await Todo.create(
      [
        {
          title,
          category,
          createdBy: req.user._id,
        },
      ],
      { session }
    );
    const todoCategory = await TodoCategory.findById(category);
    if (todoCategory) {
      await TodoCategory.findOneAndUpdate(
        { _id: category },
        { $inc: { total_count: 1 } },
        { session }
      );
    } else {
      throw ApiError.notFound("Category not found");
    }
    await session.commitTransaction();
    session.endSession();
    const populatedTodo = await Todo.findById(todo[0]._id).populate("category");
    res.status(200);
    res.json(populatedTodo);
  })
);

todoRouter.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    let todos = await Todo.find({ createdBy: req.user._id })
      .sort("createdAt")
      .populate("category");
    if (!_.isEmpty(todos)) {
      res.status(200);
      res.send(todos);
    } else {
      throw ApiError.notFound("No todos found.");
    }
  })
);

//Delete todo

todoRouter.delete(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    const session = await Todo.startSession();
    session.startTransaction();
    const filter = { _id: req.params.id, createdBy: req.user._id };
    const todo = await Todo.findOneAndDelete(filter, { session });
    if (todo) {
      const todoCategory = await TodoCategory.findById(todo.category);
      if (todoCategory) {
        await TodoCategory.findOneAndUpdate(
          { _id: todo.category },
          { $inc: { total_count: -1 } },
          { session }
        );
      } else {
        throw ApiError.notFound("Category not found");
      }
    } else {
      throw ApiError.notFound("Todo not found");
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200);
    res.send(todo);
  })
);

// Mark complete or incomplete Todo
todoRouter.put(
  "/:id/completed",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    const session = await Todo.startSession();
    session.startTransaction();
    const filter = { _id: req.params.id, createdBy: req.user._id };
    const data = await Todo.findById(req.params.id);
    if (data) {
      await Todo.findOneAndUpdate(filter, {
        completed: req.body.completed,
      });
      const todoCategory = await TodoCategory.findById(data.category);
      if (todoCategory) {
        if (req.body.completed) {
          await TodoCategory.findOneAndUpdate(
            { _id: data.category },
            { $inc: { completed_count: 1 } },
            { session }
          );
        } else {
          await TodoCategory.findOneAndUpdate(
            { _id: data.category },
            { $inc: { completed_count: -1 } },
            { session }
          );
        }
      } else {
        throw ApiError.notFound("Category not found");
      }
    }
    await Todo.findOneAndUpdate(
      filter,
      { completed: req.body.completed },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    const todo = await Todo.findOne(filter).populate("category");
    res.status(200);
    res.json(todo);
  })
);

// Update Todo
todoRouter.put(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    const { title, category } = req.body;
    const session = await Todo.startSession();
    session.startTransaction();
    const filter = { _id: req.params.id, createdBy: req.user._id };
    const prvTodo = await Todo.findOne(filter);

    if (prvTodo) {
      await Todo.findOneAndUpdate(filter, { title, category }, { session });
      const prvTodoCategory = await TodoCategory.findById(prvTodo.category);

      if (prvTodoCategory) {
        const total_count = await Todo.count({ category: prvTodo.category });
        const completed_count = await Todo.count({
          category: prvTodo.category,
          completed: true,
        });
        await TodoCategory.updateOne(
          { _id: prvTodo.category },
          {
            total_count: total_count - 1,
            ...(prvTodo.completed && { completed_count: completed_count - 1 }),
          },
          { session }
        );
      } else {
        throw ApiError.notFound("Category not found");
      }
      const todoCategory = await TodoCategory.findById(category);

      if (todoCategory) {
        const total_count = await Todo.count({ category: category });
        const completed_count = await Todo.count({
          category: category,
          completed: true,
        });
        await TodoCategory.updateOne(
          { _id: category },
          {
            total_count: total_count + 1,
            ...(prvTodo.completed && { completed_count: completed_count + 1 }),
          },
          { session }
        );
      } else {
        throw ApiError.notFound("Category not found");
      }
    } else {
      throw ApiError.notFound("Todo not found");
    }
    await session.commitTransaction();
    session.endSession();
    const todo = await Todo.findOne(filter).populate("category");
    res.status(200);
    res.json(todo);
  })
);

//find a todo
todoRouter.get(
  "/:id",
  authMiddleware,
  permit,
  asyncHandler(async (req: IUserAuthInfoRequest, res): Promise<any> => {
    const filter = { _id: req.params.id, createdBy: req.user._id };
    const data = await Todo.findOne(filter).populate("category");

    if (data) {
      res.status(200);
      res.send(data);
    } else {
      res.status(401);
      throw ApiError.notFound("Not found.");
    }
  })
);

export default todoRouter;
