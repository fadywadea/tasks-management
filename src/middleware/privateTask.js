"use strict";

import { taskModel } from "../../database/models/task.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";

// To check if anyone is trying to get a private task by typing a query into the URL like => ?visible=private
export const privateTask = catchError(async (req, res, next) => {
  try {
    let task;
    if (req.params.id) {
      task = await taskModel.findById(req.params.id);
      if(!task) return next(new AppError("Task not found.", 404));
      if (task.visible == "private") return next(new AppError("This is a private task.", 403));
    }
    if (req.query.visible == "private") return next(new AppError("This is a private tasks.", 403));
    next();
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
})
