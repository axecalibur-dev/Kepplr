import mongoose from "mongoose";

const blackListedToken = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    token_string: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "s",
      required: true,
    },
  },
  { minimize: false },
);

export const BlacklistedTokens = mongoose.model(
  "BlacklistedTokens",
  blackListedToken,
);
