"use strict";

import { globalError } from "../middleware/globalError.js";
import { AppError } from "../utils/appError.js";
import categoryRouter from "./category/category.routes.js";
import taskRouter from "./task/task.routes.js";
import userRouter from "./user/user.routes.js";

export const bootstrap = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/task", taskRouter);

  // Error messages if there are any errors in the routes
  app.use("*", (req, res, next) => { next(new AppError(`Not found endPoint: ${req.originalUrl}`, 404)); });

  // Global Error Handle
  app.use(globalError);
};
