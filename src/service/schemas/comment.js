'use strict';

const Joi = require(`joi`).extend(require(`@hapi/joi-date`));

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .max(150)
    .required()
    .empty(``)
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Комментарий не может быть пустым`,
    }),
});
