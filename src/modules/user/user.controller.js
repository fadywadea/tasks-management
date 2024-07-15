"use strict";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catchError.js";
import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/appError.js";

const signUp = catchError(async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
    res.status(201).json({ message: "success", token });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const signin = catchError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return next(new AppError("Wrong Email.", 401));
    if (!bcrypt.compareSync(password, user.password)) return next(new AppError("Wrong Password.", 401));
    const { name, _id, role } = user;
    const token = jwt.sign({ userId: _id, role }, process.env.JWT_KEY);
    res.status(200).json({ message: `Welcome ${name}.`, token });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

const changePassword = catchError(async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) return next(new AppError("No User Found!", 404));
    if (!bcrypt.compareSync(password, user.password)) return next(new AppError("Wrong Password!", 401));
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
    await userModel.findByIdAndUpdate(
      req.user._id,
      { password: newPassword, passwordUpdatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: "success", token });
  } catch (e) {
    res.status(500).json({ error: `Error in server: ${e}` });
  }
});

export { signUp, signin, changePassword };
