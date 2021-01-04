'use strict';

const Joi = require(`joi`).extend(require(`@hapi/joi-date`));

const {
  Title,
  Announce,
  FullText,
  Categories,
  ErrorMessages,
} = require(`./constants.js`);


module.exports = () => {
  return Joi.object({
    createdDate: Joi.date()
      .format(`DD.MM.YYYY, HH:mm`)
      .required()
      .messages({
        'any.required': ErrorMessages.REQUIRED,
        'date.format': ErrorMessages.DATE_FORMAT,
      }),

    title: Joi.string()
      .min(Title.MIN)
      .max(Title.MAX)
      .required()
      .messages({
        'string.min': ErrorMessages.STRING_MIN,
        'string.max': ErrorMessages.STRING_MAX,
        'any.required': ErrorMessages.REQUIRED
      }),

    pictureFilename: Joi.string()
      .empty(``),

    picture: Joi.string(),

    categories: Joi.array()
      .items(Joi.number().integer())
      .min(Categories.MIN)
      .required()
      .messages({
        'array.min': ErrorMessages.MIN_CATEGORIES,
      }),

    announce: Joi.string()
      .min(Announce.MIN)
      .max(Announce.MAX)
      .required()
      .messages({
        'string.min': ErrorMessages.STRING_MIN,
        'string.max': ErrorMessages.STRING_MAX,
        'any.required': ErrorMessages.REQUIRED,
      }),

    fullText: Joi.string()
      .max(FullText.MAX)
      .empty(``)
      .messages({
        'string.max': ErrorMessages.STRING_MAX,
      }),

    userId: Joi.number()
      .required()
      .integer()
      .messages({
        'any.required': ErrorMessages.REQUIRED,
      }),

    articleId: Joi.number().integer(),
  });
};
