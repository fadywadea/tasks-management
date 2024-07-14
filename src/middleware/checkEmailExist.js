"use strict";

import { userModel } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";

export const checkEmail = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  user && next(new AppError("Email already in use.", 409))
  !user && next();
};
