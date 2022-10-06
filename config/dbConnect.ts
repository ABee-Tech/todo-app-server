import mongoose from "mongoose";

const dbConnect = () =>
  mongoose.connect(process.env.MONGO_URI || "", {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  });

export default dbConnect;
