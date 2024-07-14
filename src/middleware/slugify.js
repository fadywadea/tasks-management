"use strict";

import slugify from "slugify";

export const createSlugify = (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  next();
};
