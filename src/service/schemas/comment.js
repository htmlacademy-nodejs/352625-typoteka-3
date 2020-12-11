'use strict';

const Joi = require(`joi`).extend(require(`@hapi/joi-date`));

const {
  Comment,
  ErrorMessages,
} = require(`./constants.js`);


module.exports = Joi.object({
  text: Joi.string()
    .min(Comment.MIN)
    .max(Comment.MAX)
    .required()
    .empty(``)
    .messages({
      'string.min': ErrorMessages.STRING_MIN,
      'string.max': ErrorMessages.STRING_MAX,
      'any.required': ErrorMessages.REQUIRED,
    }),
});
