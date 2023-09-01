import mongoose from "mongoose";

export const taskPerformance = new mongoose.Schema(
  {
    scheduled_at: {
      type: Date,
      default: Date.now,
    },
    completed_at: {
      type: Date,
      default: null,
    },
    queue_name: {
      type: String,
      required: true,
    },
    job_name: {
      type: String,
      required: true,
    },

    result: {
      type: String,
    },

    args: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      required: true,
    },

    SysID: {
      type: String,
      required: true,
    },

    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { minimize: false },
);
