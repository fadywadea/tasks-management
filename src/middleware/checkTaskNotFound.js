"use strict";

import { taskModel } from "../../database/models/task.model.js";
import { catchError } from "./catchError.js";

export const checkTaskNotFound = catchError(async (req, res, next) => {
  try {
    const { tasks } = req.body;
    const task = await taskModel.find({ _id: { $in: tasks } })
    next();
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});