const mongoose = require("mongoose");

const TodoCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const TodoCategory = mongoose.model("TodoCategory", TodoCategorySchema);

module.exports = TodoCategory;
