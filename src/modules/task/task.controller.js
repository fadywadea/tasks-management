"use strict";


import { taskModel } from "../../../database/models/task.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";
import { addOne, deleteOne, updateOne } from "../handlers/handlers.js";

const addTask = addOne(taskModel);

const getAllTasks = catchError(async (req, res, next) => {
  try {
    const tasks = taskModel.find({ visible: "public" }).populate('category', '-_id name').populate('listTask', '-_id name');
    const apiFeatures = new ApiFeatures(tasks, req.query).pagination().fields().sort().search().filter();
    const document = await apiFeatures.mongooseQuery;
    // To check if anyone is trying to get a private task by typing a query into the URL like => ?visible=private
    if (document[0].visible == 'private') return next(new AppError("You don't have permission to perform this action.", 403));
    res.status(200).json({ message: "success", page: apiFeatures.pageNumber, document });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const privateTasks = catchError(async (req, res, next) => {
  try {
    const tasks = taskModel.find({ $and: [{ visible: 'private' }, { createdBy: req.user._id }] })
      .populate('category').populate('category', '-_id name').populate('listTask', '-_id name');
    const apiFeatures = new ApiFeatures(tasks, req.query).pagination().fields().sort().search().filter();
    const document = await apiFeatures.mongooseQuery;
    res.status(200).json({ message: "success", page: apiFeatures.pageNumber, document });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const updateTask = updateOne(taskModel);

const deleteTask = deleteOne(taskModel);

export { addTask, getAllTasks, privateTasks, updateTask, deleteTask };
