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
const morgan = require("morgan");
const apiErrorHandler = require("./handlers/handleError");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);
app.use("/api/todo_categories", todoCategoryRouter);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.code = 404;
  next(error);
});

app.use(apiErrorHandler);

process.on("uncaughtException", function (err) {
  // Handle the error safely
  console.log(err);
});

//End of deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
