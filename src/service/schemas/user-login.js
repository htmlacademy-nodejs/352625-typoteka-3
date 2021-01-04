'use strict';

const Joi = require(`joi`);

const {
  User,
  ErrorMessages,
} = require(`./constants.js`);


module.exports = () => {
  return Joi.object({
    email: Joi.string()
      .min(User.Email.MIN)
      .max(User.Email.MAX)
      .required()
      .messages({
        'string.min': ErrorMessages.STRING_MIN,
        'string.max': ErrorMessages.STRING_MAX,
        'any.required': ErrorMessages.REQUIRED,
      }).email().messages({
        'string.email': ErrorMessages.INVALID_EMAIL,
      }),

    password: Joi.string()
      .min(User.Password.MIN)
      .max(User.Password.MAX)
      .required()
      .messages({
        'string.min': ErrorMessages.STRING_MIN,
        'string.max': ErrorMessages.STRING_MAX,
        'any.required': ErrorMessages.REQUIRED,
        'string.empty': ErrorMessages.EMPTY_STRING,
      }),
  });
};
