'use strict';

const Joi = require(`joi`).extend(require(`@hapi/joi-date`));

module.exports = Joi.object({
  [`created_date`]: Joi.date()
    .format(`DD.MM.YYYY`)
    .required()
    .messages({
      'any.required': `Это обязательное поле`
    }),

  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Это обязательное поле`
    }),

  [`picture_filename`]: Joi.string()
    .empty(``),

  picture: Joi.string(),

  categories: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .required()
    .messages({
      'array.min': `Выберите хотя бы одну категорию`
    }),

  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Это обязательное поле`
    }),

  [`full_text`]: Joi.string()
    .max(1000)
    .empty(``)
    .messages({
      'string.max': `Длина не должна превышать {#limit} символов`,
    }),
});
