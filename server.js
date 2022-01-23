require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const error = require("./middlewares/errorMiddleware");
const userRouter = require("./routes/userRoutes");
const todoRouter = require("./routes/todoRoutes");
const todoCategoryRouter = require("./routes/todoCategoryRoutes");
require("./config/dbConnect")();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);
app.use("/api/todo_categories", todoCategoryRouter);

app.get("/", (req, res) => {
  res.send("API is running....");
});

//====Catch Error
app.use(error.notfoundErrorMiddleware);
app.use(error.errorMiddlewareHandler);

//End of deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
