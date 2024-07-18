"use strict";

import { categoryModel } from "../../../database/models/category.model.js";
import { taskModel } from "../../../database/models/task.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";
import { addOne, deleteOne, updateOne, } from "../handlers/handlers.js";

const addCategory = addOne(categoryModel);

const getAllCategories = catchError(async (req, res, next) => {
  try {
    let category = categoryModel.find().populate('tasks', '-_id name textTask visible');
    const apiFeatures = new ApiFeatures(category, req.query).pagination().fields().sort().search().filter();
    const document = await apiFeatures.mongooseQuery;
    document.forEach(task => {
      task.tasks = task.tasks.filter(tasks => tasks.visible !== "private");
    });
    res.status(200).json({ message: "success", page: apiFeatures.pageNumber, document });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const getSingleCategory = catchError(async (req, res, next) => {
  try {
    let category;
    category = await categoryModel.findById(req.params.id);
    // Hide private tasks from the tasks category
    if (category?.tasks) {
      const tasks = await Promise.all(category.tasks.map(async (element) => await taskModel.findById(element,
        '-_id name slug visible'
      ))).then(tasks => tasks.filter(task => task.visible !== "private"));
      category.tasks = tasks;
    }
    !category && next(new AppError("Document not found.", 404));
    category && res.status(200).json({ message: "success", category: { name: category.name, slug: category.slug, tasks: category.tasks, createdBy: category.createdBy } });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const updateCategory = updateOne(categoryModel);

const deleteCategory = deleteOne(categoryModel);

export { addCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory, };
