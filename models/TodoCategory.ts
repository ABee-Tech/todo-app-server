import mongoose from "mongoose";

interface ITodoCategory {
  _id: string;
  name: string;
  progress: number;
  color: string;
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
    color: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

//Popuplating this field of todos to users
TodoCategorySchema.virtual("todos", {
  ref: "Todo",
  foreignField: "category",
  localField: "_id",
});
TodoCategorySchema.set("toJSON", { virtuals: true });
//=== END=======

const TodoCategory = mongoose.model<ITodoCategory>(
  "TodoCategory",
  TodoCategorySchema
);

export default TodoCategory;
