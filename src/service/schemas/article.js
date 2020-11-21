'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  [`created_date`]: Joi.date()
    // TODO добавить время
    .format(`DD.MM.YYYY`)
    .required(),
  [`title`]: Joi.string()
    .min(30)
    .max(250)
    .required(),
  [`picture-name`]: Joi.string(),
  [`picture`]: Joi.string(),
  // TODO category-..., category-..., category-...
  [`announce`]: Joi.string()
    .min(30)
    .max(250)
    .required(),
  [`full_text`]: oi.string()
    .max(1000),
});
