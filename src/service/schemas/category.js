'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  category: Joi.string()
    .min(2)
    .max(30)
    .required()
    .empty(``)
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Категория не может быть пустой`,
    }),
});
