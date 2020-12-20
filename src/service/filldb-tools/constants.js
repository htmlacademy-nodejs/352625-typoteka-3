'use strict';

// AUTH_USER_ID = 0 --> Не авторизован ни один пользователь;
// AUTH_USER_ID === ADMIN_USER_ID --> Авторизован Админ блога;
// AUTH_USER_ID = 2 --> Авторизован Читатель блога;
const AUTH_USER_ID = 1;
const ADMIN_USER_ID = 1; // ID администратора блога

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
  ADMIN_USER_ID,
  Comments,
  Categories,
  PASSWORD_LENGTH,
};
