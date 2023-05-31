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
import { upload } from "../middlewares/upload";
import Image from "../models/Image";

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
    const userExist = await User.findOne({ email: email }).populate(
      "profile_picture"
    );

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
    const user = await User.findOne({ email: email }, ["+password"]).populate(
      "profile_picture"
    );
    //Compare password
    if (user && (await user.isPasswordMatch(password))) {
      res.status(201);
      res.status(200);
      res.json({
        _id: user._id,
        name: user.name,
        profile_picture: user.profile_picture,
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
    const user = await User.findById(req.user._id)
      .populate("todos")
      .populate("profile_picture");
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
    const user = await User.findById(req.user._id).populate("profile_picture");
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
        profile_picture: updateUser.profile_picture,
        name: updateUser.name,
        email: updateUser.email,
        token: authTokenGenerator(updateUser._id),
      });
    } else {
      res.status(401);
      throw ApiError.notFound("User Not found");
    }
  })
);

//UPDATE PROFILE PICTURE

userRouter.put(
  "/profile/picture",
  authMiddleware,
  upload.single("upload"),
  asyncHandler(async (req: IUserAuthInfoRequest, res: Response) => {
    const imageData = {
      name: req.file.filename,
      desc: req.file.destination,
      img: {
        imageUrl: req.file.path,
        contentType: req.file.mimetype,
      },
    };

    const session = await Image.startSession();
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });
    const image = await Image.create([imageData], { session });

    const user = await User.findById(req.user._id);
    if (user) {
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { profile_picture: image[0]._id },
        { session }
      );
    } else {
      throw ApiError.notFound("User not found");
    }
    await session.commitTransaction();
    session.endSession();
    const populatedUser = await User.findById(req.user._id).populate(
      "profile_picture"
    );
    res.status(200);
    res.json(populatedUser);
  })
);

//Fetch all Users

userRouter.get(
  "/",
  asyncHandler(async (req: IUserAuthInfoRequest, res: Response) => {
    if (req.user.role !== "admin") {
      const users = await User.find()
        .populate("todos")
        .populate("profile_picture");
      res.status(200);
      res.json(users);
    } else {
      throw ApiError.unauthorized("You are not authorized to view this page");
    }
  })
);

export default userRouter;
