require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");
require("./config/dbConnect")();
const app = express();
const morgan = require("morgan");
const apiErrorHandler = require("./handlers/handleError");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(
  "/",
  (req, res, next) => {
    console.log("=====================");
    console.log("req.body:", req.body);
    console.log("req.query:", req.query);
    next();
  },
  apiRouter
);

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
