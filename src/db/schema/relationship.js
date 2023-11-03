import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },

    // Person A follows B
    personA: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Friends",
    },

    personB: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Friends",
    },
  },
  { minimize: false },
);

export const Relationships = mongoose.model(
  "Relationships",
  relationshipSchema,
);
