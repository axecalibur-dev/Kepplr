import mongoose from "mongoose";
import TaskConstants from "../../globals/constants/task_constants";

const taskLoggerSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  task_name: {
    type: String,
    required: true,
  },

  job_id: {
    type: String,
    required: true,
  },

  queue: {
    type: String,
    required: true,
  },

  arguments: {
    type: Array,
    required: false,
  },

  return_statement: {
    type: String,
    required: false,
  },

  exception: {
    type: String,
    required: true,
    default: "#NOERROR",
  },

  final_status: {
    type: String,
    enum: [
      TaskConstants.SUCCESS,
      TaskConstants.FAILED,
      TaskConstants.DANGLING,
      TaskConstants.FIRED,
    ],
    default: TaskConstants.FIRED,
  },
});

export const TaskLogger = mongoose.model("TaskLogger", taskLoggerSchema);
