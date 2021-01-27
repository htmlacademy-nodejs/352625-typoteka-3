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

const User = {
  Firstname: {
    MIN: 2,
    MAX: 50,
  },
  Lastname: {
    MIN: 2,
    MAX: 50,
  },
  Password: {
    MIN: 6,
    MAX: 20,
  },
  Email: {
    MIN: 6,
    MAX: 100,
  }
};

const ErrorMessages = {
  REQUIRED: `Это обязательное поле`,
  DATE_FORMAT: `Требуемый формат даты: '{#format}'`,
  STRING_MIN: `Длина должна быть не менее {#limit} символов`,
  STRING_MAX: `Длина не должна превышать {#limit} символов`,
  MIN_CATEGORIES: `Выберите хотя бы одну категорию`,
  INVALID_EMAIL: `Невалидный email`,
  EMAIL_EXIST: `Этот email занят`,
  RETYPE_PASSWORDS: `Пароли не совпали - повторите еще раз`,
  EMPTY_STRING: `Пустая строка`,
  USER_NOT_EXIST: `Такого пользователя не существует`,
  ARTICLE_NOT_EXIST: `Такой публикации не существует`,
  COMMENT_NOT_EXIST: `Такого комментария не существует`,
  INVALID_PASSWORD: `Невалидный пароль`,
  UNAUTHORIZED: `Действие не авторизовано`,
};

module.exports = {
  Title,
  Announce,
  FullText,
  Categories,
  Category,
  Comment,
  User,
  ErrorMessages,
};
