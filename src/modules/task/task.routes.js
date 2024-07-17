"use strict";

import express from "express";
import { validation } from "../../middleware/validation.js";
import { authorization, protectedRoutes } from "../auth/auth.controller.js";
import { addTaskVal, paramsIdVal, updateTaskVal } from "./task.validation.js";
import { addTask, deleteTask, getAllTasks, OnePrivateTask, onePublicTask, privateTasks, updateTask, } from "./task.controller.js";
import { privateTask } from "../../middleware/privateTask.js";
import { checkCategoryNotFound } from "../../middleware/checkCategoryNotFound.js";

const taskRouter = express.Router();

taskRouter
  .route("/")
  .post(protectedRoutes, authorization("user"), validation(addTaskVal), checkCategoryNotFound, addTask)
  .get(privateTask, getAllTasks);

taskRouter
  .route("/private-tasks")
  .get(protectedRoutes, authorization("user"), privateTasks);

taskRouter
  .route("/private-task/:id")
  .get(protectedRoutes, authorization("user"), OnePrivateTask);

taskRouter
  .route("/:id")
  .patch(protectedRoutes, validation(updateTaskVal), updateTask)
  .delete(protectedRoutes, validation(paramsIdVal), deleteTask)
  .get(privateTask, onePublicTask);

export default taskRouter;
