import mongoose from "mongoose";

interface ISetting {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  profile_picture: string;
}

interface ISettingDocument extends ISetting, Document {
  isPasswordMatch(enteredPassword: string): Promise<boolean>;
}

const SettingSchema = new mongoose.Schema<ISettingDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  theme: {
    type: String,
    enum: ["dark", "light"],
    required: false,
  },
});

const Setting = mongoose.model<ISettingDocument>("Setting", SettingSchema);

export default Setting;
