"use strict";

import express from "express";
import { changePasswordVal, signinVal, signUpVal } from "./user.validation.js";
import { signin, signUp, changePassword } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { checkEmail } from "../../middleware/checkEmailExist.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const userRouter = express.Router();

userRouter.route("/signup").post(validation(signUpVal), checkEmail, signUp);
userRouter.route("/signin").post(validation(signinVal), signin);
userRouter.route("/changePassword").patch(validation(changePasswordVal), protectedRoutes, changePassword);

export default userRouter;
