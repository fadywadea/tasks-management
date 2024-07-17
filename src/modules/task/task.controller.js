"use strict";

import { taskModel } from "../../../database/models/task.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";
import { addOne, deleteOne, findOne, getAll, updateOne } from "../handlers/handlers.js";

const addTask = addOne(taskModel);

const getAllTasks = getAll(taskModel);

const privateTasks = catchError(async (req, res, next) => {
  try {
    const tasks = taskModel.find({ $and: [{ visible: "private" }, { createdBy: req.user._id }] });
    const apiFeatures = new ApiFeatures(tasks, req.query).pagination().fields().sort().search().filter();
    const document = await apiFeatures.mongooseQuery;
    document.length <= 0 && next(new AppError("Tasks not found.", 404));
    document.length > 0 && res.status(200).json({ message: "success", page: apiFeatures.pageNumber, document });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const OnePrivateTask = catchError(async (req, res, next) => {
  try {
    const task = await taskModel.findOne({
      _id: req.params.id, $and: [{ visible: "private" }, { createdBy: req.user._id }],
    });
    !task && next(new AppError("Task not found.", 404));
    task && res.status(200).json({ message: "success", task });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const onePublicTask = findOne(taskModel);

const updateTask = updateOne(taskModel);

const deleteTask = deleteOne(taskModel);

export { addTask, getAllTasks, privateTasks, OnePrivateTask, onePublicTask, updateTask, deleteTask, };
