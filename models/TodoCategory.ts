import mongoose from 'mongoose';

interface ITodoCategory {
  _id: string;
  name: string;
  total_count: number;
  completed_count: number;
  color: string;
  createdBy: string;
}

const TodoCategorySchema = new mongoose.Schema<ITodoCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    total_count: {
      type: Number,
      required: false,
    },
    completed_count: {
      type: Number,
      required: false,
    },
    color: {
      type: String,
      enum: [
        '#55efc4',
        '#6c5ce7',
        '#07bc0c',
        '#e74c3c',
        '#3498db',
        '#e84393',
        '#f1c40f',
        '#2ecc71',
        '#9b59b6',
      ],
      required: true,
    },
    isDefault: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

//Popuplating this field of todos to users
TodoCategorySchema.virtual('todos', {
  ref: 'Todo',
  foreignField: 'category',
  localField: '_id',
});
TodoCategorySchema.set('toJSON', { virtuals: true });
//=== END=======

const TodoCategory = mongoose.model<ITodoCategory>(
  'TodoCategory',
  TodoCategorySchema
);

export default TodoCategory;
