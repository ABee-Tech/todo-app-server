import mongoose from "mongoose";

interface IImage {
  _id: string;
  name: string;
  desc: string;
  img: {
    imageUrl: string;
    contentType: string;
  };
}

const ImageSchema = new mongoose.Schema<IImage>({
  name: String,
  desc: String,
  img: {
    imageUrl: String,
    contentType: String,
  },
});

// Populating this field of image to users
ImageSchema.virtual("profile_picture", {
  ref: "User",
  foreignField: "profile_picture",
  localField: "_id",
});
ImageSchema.set("toJSON", { virtuals: true });

const Image = mongoose.model<IImage>("Image", ImageSchema);

export default Image;
