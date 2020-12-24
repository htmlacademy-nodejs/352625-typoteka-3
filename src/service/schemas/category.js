'use strict';

const Joi = require(`joi`);

const {
  Category,
  ErrorMessages,
} = require(`./constants.js`);


module.exports = () => Joi.object({
  category: Joi.string()
    .min(Category.MIN)
    .max(Category.MAX)
    .required()
    .empty(``)
    .messages({
      'string.min': ErrorMessages.STRING_MIN,
      'string.max': ErrorMessages.STRING_MAX,
      'any.required': ErrorMessages.REQUIRED,
    }),
});
