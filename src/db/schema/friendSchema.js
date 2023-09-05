import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    age: {
      type: String,
    },

    language: {
      type: String,
    },

    contacts: {
      type: Array,
    },

    registration_source: {
      type: String,
      enum: ["Google", "Facebook", "Email"],
      required: true,
      default: "Email",
    },

    oAuthCredentials: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { minimize: false },
);

export const Friends = mongoose.model("Friends", friendSchema);
