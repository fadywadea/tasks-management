"use strict";

import { categoryModel } from "../../../database/models/category.model.js";
import { addOne, deleteOne, findOne, getAll, updateOne, } from "../handlers/handlers.js";

const addCategory = addOne(categoryModel);

const getAllCategories = getAll(categoryModel);

const getSingleCategory = findOne(categoryModel);

const updateCategory = updateOne(categoryModel);

const deleteCategory = deleteOne(categoryModel);

export { addCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory, };
