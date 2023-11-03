import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    company_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    building: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    primary_contact: {
      type: String,
      required: true,
    },
    secondary_contact: {
      type: String,
      required: true,
    },
  },
  { minimize: false },
);

export const Company = mongoose.model("Company", companySchema);
