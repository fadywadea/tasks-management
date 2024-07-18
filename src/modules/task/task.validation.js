"use strict";

import Joi from "joi";

const addTaskVal = Joi.object({
  name: Joi.string().min(2).max(50).required().trim(),
  textTask: Joi.string().min(2).max(200).trim().required(),
  listTask: Joi.array().items(Joi.string().hex().length(24)).required(),
  category: Joi.string().hex().length(24).required(),
  visible: Joi.string().valid("private", "public").default("public"),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const updateTaskVal = Joi.object({
  name: Joi.string().min(2).max(50).trim(),
  textTask: Joi.string().min(2).max(200).trim(),
  listTask: Joi.array().items(Joi.string().hex().length(24)),
  category: Joi.string().hex().length(24),
  visible: Joi.string().valid("private", "public").default("public"),
  id: Joi.string().hex().length(24).required(),
});

export { addTaskVal, paramsIdVal, updateTaskVal };
