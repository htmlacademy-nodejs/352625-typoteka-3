'use strict';

const Title = {
  MIN: 30,
  MAX: 250,
};

const Announce = {
  MIN: 30,
  MAX: 250,
};

const FullText = {
  MAX: 1000,
};

const Category = {
  MIN: 2,
  MAX: 30,
};

const Categories = {
  MIN: 1,
};

const Comment = {
  MIN: 20,
  MAX: 150,
};

const ErrorMessages = {
  REQUIRED: `Это обязательное поле`,
  DATE_FORMAT: `Требуемый формат даты: '{#format}'`,
  STRING_MIN: `Длина должна быть не менее {#limit} символов`,
  STRING_MAX: `Длина не должна превышать {#limit} символов`,
  MIN_CATEGORIES: `Выберите хотя бы одну категорию`,
};

module.exports = {
  Title,
  Announce,
  FullText,
  Categories,
  Category,
  Comment,
  ErrorMessages,
};
