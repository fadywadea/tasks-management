"use strict";

import { taskModel } from "../../database/models/task.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";

export const checkTaskNotFound = catchError(async (req, res, next) => {
  try {
    const tasks = await Promise.all(req.body.tasks.map(async (element) => await taskModel.findOne({ _id: element, createdBy: req.user._id })));
    tasks.some(task => !task) && next(new AppError("Task not found.", 404));
    tasks.some(task => task) && next();
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});