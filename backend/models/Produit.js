import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, default: null },
});

export default mongoose.model("Task", taskSchema);
