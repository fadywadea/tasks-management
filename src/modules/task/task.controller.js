"use strict";

import { taskModel } from "../../../database/models/task.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";
import { addOne, deleteOne, updateOne } from "../handlers/handlers.js";

const addTask = addOne(taskModel);

const getAllTasks = catchError(async (req, res, next) => {
  try {
    const tasks = taskModel.find({ visible: "public" }).populate("listTask", "-_id name textTask visible");
    const apiFeatures = new ApiFeatures(tasks, req.query).pagination().fields().sort().search().filter();
    const document = await apiFeatures.mongooseQuery;
    document.forEach(task => { task.listTask = task.listTask.filter(listTask => listTask.visible !== "private"); });
    res.status(200).json({ message: "success", page: apiFeatures.pageNumber, document });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

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

const onePublicTask = catchError(async (req, res, next) => {
  try {
    const { task } = req;
    !task && next(new AppError("Task not found.", 404));
    task && res.status(200).json({
      message: "success",
      task: {
        name: task.name, slug: task.slug, listTask: task.listTask, visible: task.visible, category: task.category,
        createdBy: task.createdBy
      }
    });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const updateTask = updateOne(taskModel);

const deleteTask = deleteOne(taskModel);

export { addTask, getAllTasks, privateTasks, OnePrivateTask, onePublicTask, updateTask, deleteTask, };
