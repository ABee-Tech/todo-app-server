import mongoose from "mongoose";

interface IImage {
  _id: string;
  name: string;
  desc: string;
  img: {
    data: Buffer;
    contentType: string;
  };
}

const imageSchema = new mongoose.Schema<IImage>({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Image = mongoose.model<IImage>("Image", imageSchema);

export default Image;
