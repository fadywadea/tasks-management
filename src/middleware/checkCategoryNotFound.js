"use strict";

import { categoryModel } from "../../database/models/category.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";


export const checkCategoryNotFound = catchError(async (req, res, next) => {
  try {
    if (req.body.category) {
      const category = await categoryModel.findById(req.body.category);
      if (!category) return next(new AppError("Category not found", 404));
    }
    next();
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});