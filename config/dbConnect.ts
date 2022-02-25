import mongoose from "mongoose";

const dbConnect = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  });
  console.log("DB connected");
};

export default dbConnect;
