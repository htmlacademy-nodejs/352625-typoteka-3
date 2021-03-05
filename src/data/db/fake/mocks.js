'use strict';

const bcrypt = require(`bcrypt`);
const {SALT_ROUNDS} = require(`../../../service/filldb-tools/constants.js`);

const mocks = {
  authors: [
    {
      [`firstname`]: `Дмитрий`,
      [`lastname`]: `Иванов`,
      [`email`]: `d_ivanov@local.com`,
      [`password`]: `qwerty321`,
      [`is_admin`]: true,
    },
    {
      [`firstname`]: `Людмила`,
      [`lastname`]: `Нефедова`,
      [`email`]: `nefedova_l@local.com`,
      [`password`]: `asdfgh456`,
      [`is_admin`]: false,
    },
  ],
  avatars: [
    {
      [`author_id`]: 1,
      [`regular`]: `avatar-1`,
      [`small`]: `avatar-small-1`,
    },
    {
      [`author_id`]: 2,
      [`regular`]: `avatar-2`,
      [`small`]: `avatar-small-2`,
    },
  ],
  articles: [
    {
      [`title`]: `Бороться с прокрастинацией несложно.`,
      [`announce`]: `Процессор заслуживает особого внимания. Достичь успеха помогут ежедневные повторения.`,
      [`full_text`]: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
      [`picture`]: `skyscraper`,
      [`created_date`]: `2020-07-21T13:24:32.853Z`,
      [`author_id`]: 1,
    },
    {
      [`title`]: `Освоить вёрстку несложно.`,
      [`announce`]: `Процессор заслуживает особого внимания.`,
      [`full_text`]: `Не стоит идти в программисты, если вам нравится только игры. Стоит только немного постараться и запастись книгами.`,
      [`picture`]: `sea`,
      [`created_date`]: `2020-08-28T18:10:25.087Z`,
      [`author_id`]: 2,
    },
    {
      [`title`]: `Это прочная древесина.`,
      [`announce`]: `А бумагу как известо делают из дерева.`,
      [`full_text`]: `Вы можете достичь всего. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
      [`picture`]: `forest`,
      [`created_date`]: `2020-10-10T15:52:22.726Z`,
      [`author_id`]: 2,
    },
  ],
  comments: [
    {
      [`text`]: `Это где ж такие красоты?`,
      [`created_date`]: `2020-09-13T01:28:10.990Z`,
      [`author_id`]: 1,
      [`article_id`]: 2,
    },
    {
      [`text`]: `Мне кажется или я уже читал это где-то?`,
      [`created_date`]: `2020-07-31T15:21:00.100Z`,
      [`author_id`]: 1,
      [`article_id`]: 3,
    },
    {
      [`text`]: `Ноутбуки победили.`,
      [`created_date`]: `2020-07-21T13:24:32.853Z`,
      [`author_id`]: 2,
      [`article_id`]: 1,
    },
    {
      [`text`]: `Планируете записать видосик на эту тему?`,
      [`created_date`]: `2020-08-28T18:10:25.087Z`,
      [`author_id`]: 1,
      [`article_id`]: 1,
    },
  ],
  categories: [
    {
      [`name`]: `Деревья`,
      [`author_id`]: 1,
    },
    {
      [`name`]: `Музыка`,
      [`author_id`]: 1,
    },
    {
      [`name`]: `Кино`,
      [`author_id`]: 1,
    },
    {
      [`name`]: `Разное`,
      [`author_id`]: 1,
    },
    {
      [`name`]: `Пустая категория`,
      [`author_id`]: 1,
    },
  ],
  articlesCategories: [
    {
      [`article_id`]: 1,
      [`category_id`]: 1,
    },
    {
      [`article_id`]: 1,
      [`category_id`]: 2,
    },
    {
      [`article_id`]: 2,
      [`category_id`]: 2,
    },
    {
      [`article_id`]: 2,
      [`category_id`]: 3,
    },
    {
      [`article_id`]: 2,
      [`category_id`]: 4,
    },
  ],
};

const convertPasswordsToHashes = (users) => {
  users.map(async (user) => {
    user[`password`] = await bcrypt.hash(user[`password`], SALT_ROUNDS);
  });
};

convertPasswordsToHashes(mocks.authors);

module.exports = {mocks};
