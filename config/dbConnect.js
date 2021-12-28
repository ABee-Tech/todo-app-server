const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.connect(
      process.env.MONGO_URI,
      {
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
      },
      () => {
        console.log("DB connected");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
