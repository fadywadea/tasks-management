"use strict";

import { categoryModel } from "../../../database/models/category.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";

const addOne = (model) => {
  return catchError(async (req, res, next) => {
    try {
      if (req.user) { req.body.createdBy = req.user._id; }
      if (req.body.category) {
        const category = await categoryModel.findById(req.body.category);
        if (!category) return next(new AppError("Category not found", 404));
      }
      const document = new model(req.body);
      await document.save();
      res.status(201).json({ message: "success", document });
    } catch (e) {
      res.status(500).json({ error: `Error in server: ${e}` });
    }
  });
};

const getAll = (model) => {
  return catchError(async (req, res, next) => {
    try {
      let getModel = model.find();
      const apiFeatures = new ApiFeatures(getModel, req.query).pagination().fields().sort().search().filter();
      const document = await apiFeatures.mongooseQuery;
      res.status(200).json({ message: "success", page: apiFeatures.pageNumber, document });
    } catch (e) {
      res.status(500).json({ error: `Error in server: ${e}` });
    }
  });
};

const findOne = (model) => {
  return catchError(async (req, res, next) => {
    try {
      const document = await model.findById(req.params.id);
      // To check if anyone is trying to get a private task by typing a query into the URL like => ?visible=private
      if (document.visible == "private")
        return next(
          new AppError("You don't have permission to perform this action.", 403)
        );
      !document && next(new AppError("Document not found.", 404));
      document && res.status(200).json({ message: "success", document });
    } catch (e) {
      res.status(500).json({ error: `Error in server: ${e}` });
    }
  });
};

const updateOne = (model) => {
  return catchError(async (req, res, next) => {
    try {
      let document;
      if (req.user) {
        document = await model.findOneAndUpdate(
          {
            _id: req.params.id,
            $or: [{ createdBy: req.user._id }, { user: req.user._id }],
          },
          req.body,
          { new: true }
        );
      } else {
        document = await model.findByIdAndUpdate(req.params.id, req.body, { new: true, });
      }
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
      let document;
      if (req.user) {
        document = await model.findOneAndDelete(
          {
            _id: req.params.id,
            $or: [{ createdBy: req.user._id }, { user: req.user._id }],
          },
          req.body,
          { new: true }
        );
      } else {
        document = await model.findByIdAndDelete(req.params.id);
      }
      !document && next(new AppError("Document not found.", 404));
      document && res.status(200).json({ message: "success" });
    } catch (e) {
      res.status(500).json({ error: `Error in server: ${e}` });
    }
  });
};

export { addOne, getAll, findOne, updateOne, deleteOne };
