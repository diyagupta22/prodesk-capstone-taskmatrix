import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  userId: String
});

export default mongoose.model("Task", taskSchema);