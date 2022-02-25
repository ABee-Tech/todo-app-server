import express from "express";
const router = express.Router();

import userRouter from "./userRoutes";
import todoRouter from "./todoRoutes";
import todoCategoryRouter from "./todoCategoryRoutes";

router.use("/api/users", userRouter);
router.use("/api/todos", todoRouter);
router.use("/api/todo_categories", todoCategoryRouter);

export default router;
