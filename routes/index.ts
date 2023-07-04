import express from "express";
const router = express.Router();

import userRouter from "./userRoutes";
import todoRouter from "./todoRoutes";
import todoCategoryRouter from "./todoCategoryRoutes";
import settingRouter from "./settingRoutes";

router.use("/api/users", userRouter);
router.use("/api/settings", settingRouter);
router.use("/api/todos", todoRouter);
router.use("/api/todo_categories", todoCategoryRouter);

export default router;
