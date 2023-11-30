import mongoose from "mongoose";

const postActionSchema = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Friends",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Posts",
    },
    action: {
      type: String,
      required: true,
    },
  },
  { minimize: false },
);

export const PostActions = mongoose.model("PostActions", postActionSchema);
