import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
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
    post_string: {
      type: String,
      required: true,
    },

    likes: {
      type: Number,
      required: true,
      default: 0,
    },

    retweets: {
      type: Number,
      required: true,
      default: 0,
    },

    isReplyTweet: { type: Boolean, required: true, default: false },

    isPrivate: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { minimize: false },
);

export const Posts = mongoose.model("Posts", postSchema);
