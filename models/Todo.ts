import mongoose from "mongoose";

interface ITodo {
  _id: string;
  title: string;
  completed: boolean;
  createdBy: string;
  category: string;
}

const TodoSchema = new mongoose.Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TodoCategory",
      required: false,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
