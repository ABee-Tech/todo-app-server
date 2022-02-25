import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
}

interface IUserDocument extends IUser, Document {
  isPasswordMatch(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
  },
  password: {
    type: String,
  },
});

//Popuplating this field of todos to users
UserSchema.virtual("todos", {
  ref: "Todo",
  foreignField: "createdBy",
  localField: "_id",
});
UserSchema.set("toJSON", { virtuals: true });
//=== END=======

//hashpassword
UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  //We only want to do this if the password is sent or modified, this is because when a user later update their password this will run and the user cannot login
  if (!this.isModified("password")) {
    next();
  }
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Verify password for login
//Methods: Apply to an instance of this model
UserSchema.methods.isPasswordMatch = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUserDocument>("User", UserSchema);

export default User;
