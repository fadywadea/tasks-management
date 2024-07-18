"use strict";

import express from "express";
import { addCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory, } from "./category.controller.js";
import { validation } from "../../middleware/validation.js";
import { addCategoryVal, paramsIdVal, updateCategoryVal, } from "./category.validation.js";
import { authorization, protectedRoutes } from "../auth/auth.controller.js";
import { checkTaskNotFound } from "../../middleware/checkTaskNotFound.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(protectedRoutes, authorization("user"), validation(addCategoryVal), checkTaskNotFound, addCategory)
  .get(getAllCategories);

categoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleCategory)
  .patch(protectedRoutes, validation(updateCategoryVal), checkTaskNotFound, updateCategory)
  .delete(protectedRoutes, validation(paramsIdVal), deleteCategory);

export default categoryRouter;
