"use strict";

import Joi from "joi";

const addCategoryVal = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24).required()
});

const updateCategoryVal = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  id: Joi.string().hex().length(24).required(),
});

export { addCategoryVal, paramsIdVal, updateCategoryVal };