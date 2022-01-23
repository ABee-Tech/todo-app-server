const express = require("express");
const asyncHandler = require("express-async-handler");
const authMiddlware = require("../middlewares/authMiddleware");
const permit = require("../middlewares/permit");
const TodoCategory = require("../models/TodoCategory");
const todoCategoryRouter = express.Router();

//Create Todo Category
todoCategoryRouter.post(
  "/",
  authMiddlware,
  asyncHandler(async (req, res) => {
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
  authMiddlware,
  asyncHandler(async (req, res) => {
    let todoCategories;
    todoCategories = await TodoCategory.find({ createdBy: req.user._id }).sort(
      "createdAt"
    );
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
  authMiddlware,
  permit,
  asyncHandler(async (req, res) => {
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
  authMiddlware,
  permit,
  asyncHandler(async (req, res) => {
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
  authMiddlware,
  permit,
  asyncHandler(async (req, res) => {
    try {
      const data = await TodoCategory.findById(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      res.status(500);
      throw new Error("No todo category found");
    }
  })
);

module.exports = todoCategoryRouter;
