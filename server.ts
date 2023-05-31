import { config } from "dotenv";
config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRouter from "./routes";
import dbConnect from "./config/dbConnect";
dbConnect();
import morgan from "morgan";
import apiErrorHandler from "./handlers/handleError";
import { ApiError } from "./handlers/buildError";
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/static/uploads", express.static("uploads"));

app.use(
  "/",
  (req: Request, _res: Response, next: NextFunction) => {
    console.log("=====================");
    console.log("req.body:", req.body);
    console.log("req.query:", req.query);
    next();
  },
  apiRouter
);

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running....");
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new ApiError(404, "Not found");
  next(error);
});

app.use(apiErrorHandler);

process.on("uncaughtException", function (err: ApiError) {
  // Handle the error safely
  console.log(err);
});

//End of deployment
const PORT: string = process.env.PORT || "5000";
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
