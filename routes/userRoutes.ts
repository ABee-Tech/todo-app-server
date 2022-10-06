import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  authMiddleware,
  IUserAuthInfoRequest,
} from "../middlewares/authMiddleware";
import User from "../models/User";
import authTokenGenerator from "../utils/authTokenGenerator";
import { ApiError } from "../handlers/buildError";
import TodoCategory from "../models/TodoCategory";

const userRouter = express.Router();

//Create user
userRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const session = await User.startSession();
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });
    const { name, email, password, role } = req.body;
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      await session.abortTransaction();
      session.endSession();
      throw ApiError.conflict("User already exists");
    }

    const user = await User.create([{ name, email, password, role }], {
      session,
    });

    await TodoCategory.create(
      [
        {
          name: "Personal",
          color: "#6c5ce7",
          total_count: 0,
          completed_count: 0,
          isDefault: true,
          createdBy: user[0]._id,
        },
        {
          name: "Work",
          color: "#55efc4",
          total_count: 0,
          completed_count: 0,
          isDefault: true,
          createdBy: user[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    if (user) {
      res.status(200);
      res.json({
        _id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
        token: authTokenGenerator(user[0]._id),
      });
    }
  })
);

userRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    //Compare password
    if (user && (await user.isPasswordMatch(password))) {
      res.status(201);
      res.status(200);
      res.json({
        _id: user._id,
        name: user.name,
        ...(user.role === "admin" ? { role: user.role } : {}),
        email: user.email,
        token: authTokenGenerator(user._id),
      });
    } else {
      res.status(401);
      throw ApiError.unauthorized("Unauthorized");
    }
  })
);

//GET PROFILE

userRouter.get(
  "/profile",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res: Response) => {
    const user = await User.findById(req.user._id).populate("todos");
    res.status(404);
    if (!user) throw ApiError.notFound(`You don't have any profile yet`);
    res.status(201);
    res.send(user);
  })
);

//UPDATE PROFILE

userRouter.put(
  "/profile/update",
  authMiddleware,
  asyncHandler(async (req: IUserAuthInfoRequest, res: Response) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      //This will encrypt automatically in our model
      if (req.body.password) {
        user.password = req.body.password || user.password;
      }
      const updateUser = await user.save();
      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        password: updateUser.password,
        email: updateUser.email,
        token: authTokenGenerator(updateUser._id),
      });
    } else {
      res.status(401);
      throw ApiError.notFound("User Not found");
    }
  })
);

//Fetch all Users

userRouter.get(
  "/",
  asyncHandler(async (req: IUserAuthInfoRequest, res: Response) => {
    if (req.user.role !== "admin") {
      const users = await User.find().populate("todos");
      res.status(200);
      res.json(users);
    } else {
      throw ApiError.unauthorized("You are not authorized to view this page");
    }
  })
);

export default userRouter;
