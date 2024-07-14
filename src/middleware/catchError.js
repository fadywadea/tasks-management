"use strict";

import { AppError } from "../utils/appError.js";

export function catchError(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      next(new AppError(err, 500));
    });
  };
}
