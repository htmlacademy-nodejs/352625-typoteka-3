'use strict';

const Tables = {
  AVATARS: `avatars`,
  AUTHORS: `authors`,
  AUTHS: `auths`,
  ARTICLES: `articles`,
  COMMENTS: `comments`,
  CATEGORIES: `categories`,
  ARTICLES_CATEGORIES: `articles_categories`,
};

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
  Tables,
  Comments,
  Categories,
  PASSWORD_LENGTH,
};
