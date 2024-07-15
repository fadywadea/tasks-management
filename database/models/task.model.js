"use strict";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
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
    textTask: String,
    listTask: [
      {
        type: mongoose.Types.ObjectId,
        ref: "task",
      },
    ],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    visible: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
  },
  { timestamps: true }
);

export const taskModel = mongoose.model("task", taskSchema);
