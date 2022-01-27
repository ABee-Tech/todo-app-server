const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const todoRouter = require("./todoRoutes");
const todoCategoryRouter = require("./todoCategoryRoutes");

router.use("/api/users", userRouter);
router.use("/api/todos", todoRouter);
router.use("/api/todo_categories", todoCategoryRouter);

module.exports = router;
