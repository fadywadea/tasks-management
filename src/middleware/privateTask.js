"use strict";

import { taskModel } from "../../database/models/task.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";

export const privateTask = catchError(async (req, res, next) => {
  try {
    let task;
    task = await taskModel.findById(req.params.id);

    // Hide private tasks
    if (req.params.id) {
      if (!task) return next(new AppError("Task not found.", 404));
      if (task.visible == "private") return next(new AppError("This is a private task.", 403));
    }
    // Hide private tasks from listTask
    if (task?.listTask) {
      const tasks = await Promise.all(task.listTask.map(async (element) => await taskModel.findById(element,
        '-_id name slug visible createdBy'))).then(tasks => tasks.filter(task => task?.visible !== "private"));
      task.listTask = tasks;
    }

    // To check if anyone is trying to get a private task by typing a query into the URL like => ?visible=private    
    if (req.query.visible == "private") return next(new AppError("This is a private tasks.", 403));

    req.task = task
    next();
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
})
