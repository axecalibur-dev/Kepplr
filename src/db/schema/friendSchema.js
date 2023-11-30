import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { Company } from "./companySchema";

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
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Company",
    },

    username_handle: {
      type: String,
      required: true,
      unique: true,
    },

    isPrivateAccount: {
      type: Boolean,
      required: true,
      default: false,
    },
    profile_picture: {
      type: String,
      required: true,
      default: "#noimage",
    },

    sharePrimaryContactEmail: {
      type: Boolean,
      required: false,
      default: false,
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
      type: Number,
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
