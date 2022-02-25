import express from "express";
import asyncHandler from "express-async-handler";
import {
  authMiddleware,
  IUserAuthInfoRequest,
} from "../middlewares/authMiddleware";
import User from "../models/User";
import authTokenGenerator from "../utils/authTokenGenerator";
import { ApiError } from "../handlers/buildError";

const userRouter = express.Router();

//Create user
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      throw ApiError.conflict("User already exists");
    }

    const user = await User.create({ name, email, password, role });
    if (user) {
      res.status(200);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: authTokenGenerator(user._id),
      });
    }
  })
);

userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    //Compare password
    if (user && (await user.isPasswordMatch(password))) {
      res.status(201);
      res.status(200);
      res.json({
        _id: user._id,
        name: user.name,
        password: user.password,
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
  asyncHandler(async (req: IUserAuthInfoRequest, res) => {
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
  asyncHandler(async (req: IUserAuthInfoRequest, res) => {
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
  asyncHandler(async (_req, res) => {
    const users = await User.find().populate("todos");
    res.status(200);
    res.json(users);
  })
);

export default userRouter;
