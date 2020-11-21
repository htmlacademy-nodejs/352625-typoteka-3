'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  [`created_date`]: Joi.date()
    .format(`DD.MM.YYYY`)
    .required(),
  [`title`]: Joi.string()
    .min(30)
    .max(250)
    .required(),
  [`picture-name`]: Joi.string(),
  [`picture`]: Joi.string(),
  [`categories`]: Joi.Array(),
  [`announce`]: Joi.string()
    .min(30)
    .max(250)
    .required(),
  [`full_text`]: Joi.string()
    .max(1000),
});
