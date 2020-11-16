'use strict';

const AUTH_USER_ID = 0; // = 0 --> Не авторизован ни один пользователь;

const Comments = {
  MIN: 2,
  MAX: 6,
};

const Categories = {
  MIN: 1,
  MAX: 5,
};

const PASSWORD_LENGTH = 8;


module.exports = {
  AUTH_USER_ID,
  Comments,
  Categories,
  PASSWORD_LENGTH,
};
