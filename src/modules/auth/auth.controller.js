"use strict";

import jwt from "jsonwebtoken";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { userModel } from "../../../database/models/user.model.js";

// Authentication
const protectedRoutes = catchError(async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) return next(new AppError("Token not provider", 401));
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findById(decoded.userId).lean();
    if (!user) return next(new AppError("User not found!", 404));
    if (user.passwordUpdatedAt && user.passwordUpdatedAt.getTime() > decoded.iat * 1000) return next(new AppError("Token Expired.", 404));
    req.user = user;
    next();
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});


// Authorization
const authorization = (...roles) => {
  return catchError(async (req, res, next) => {
    try {
      !roles.includes(req.user.role) && next(new AppError("You don't have permission to perform this action.", 403));
      roles.includes(req.user.role) && next();
    } catch (e) {
      res.status(500).json({ message: `Error in server: ${e}` });
    }
  });
};

export { protectedRoutes, authorization };
