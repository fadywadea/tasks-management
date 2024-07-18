"use strict";

import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const addOne = (model) => {
  return catchError(async (req, res, next) => {
    try {
      if (req.user) { req.body.createdBy = req.user._id; }
      if (req.body.name) req.body.slug = slugify(req.body.name);
      const document = new model(req.body);
      await document.save();
      res.status(201).json({ message: "success", document });
    } catch (e) {
      res.status(500).json({ error: `Error in server: ${e}` });
    }
  });
};

const updateOne = (model) => {
  return catchError(async (req, res, next) => {
    try {
      if (req.body.name) req.body.slug = slugify(req.body.name);
      let document = await model.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.body, { new: true });
      !document && next(new AppError("Document not found.", 404));
      document && res.status(200).json({ message: "success", document });
    } catch (e) {
      res.status(500).json({ error: `Error in server: ${e}` });
    }
  });
};

const deleteOne = (model) => {
  return catchError(async (req, res, next) => {
    try {
      let document = await model.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id, }, req.body, { new: true });
      !document && next(new AppError("Document not found.", 404));
      document && res.status(200).json({ message: "success" });
    } catch (e) {
      res.status(500).json({ error: `Error in server: ${e}` });
    }
  });
};

export { addOne, updateOne, deleteOne };
