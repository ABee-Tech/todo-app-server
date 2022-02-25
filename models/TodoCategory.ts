import mongoose from "mongoose";

interface ITodoCategory {
  _id: string;
  name: string;
  progress: number;
  createdBy: string;
}

const TodoCategorySchema = new mongoose.Schema<ITodoCategory>(
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

const TodoCategory = mongoose.model<ITodoCategory>(
  "TodoCategory",
  TodoCategorySchema
);

export default TodoCategory;
