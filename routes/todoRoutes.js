const express = require("express");
const asyncHandler = require("express-async-handler");
const authMiddlware = require("../middlewares/authMiddleware");
const permit = require("../middlewares/permit");
const Todo = require("../models/Todo");
const todoRouter = express.Router();

//Create Todo
todoRouter.post(
  "/",
  authMiddlware,
  asyncHandler(async (req, res) => {
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
  authMiddlware,
  asyncHandler(async (req, res) => {
    let todos;
    if (req.user.role !== "admin") {
      todos = await Todo.find({ createdBy: req.user._id }).sort("createdAt");
    } else {
      todos = await Todo.find().sort("createdAt").populate("createdBy");
    }
    //Compare password
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
  authMiddlware,
  permit,
  asyncHandler(async (req, res) => {
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
  authMiddlware,
  permit,
  asyncHandler(async (req, res) => {
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
  authMiddlware,
  permit,
  asyncHandler(async (req, res) => {
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
  authMiddlware,
  permit,
  asyncHandler(async (req, res) => {
    try {
      const data = await Todo.findById(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      res.status(500);
      throw new Error("No todo found");
    }
  })
);

module.exports = todoRouter;
