"use strict";

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, " too short category name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    tasks: [{
      type: mongoose.Types.ObjectId,
      ref: "task",
    }],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const categoryModel = mongoose.model("category", categorySchema);
