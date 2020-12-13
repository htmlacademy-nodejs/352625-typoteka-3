'use strict';

const ArticleService = require(`./article.js`);
const AuthService = require(`./auth.js`);
const CategoryService = require(`./category.js`);
const CommentService = require(`./comment.js`);
const SearchService = require(`./search.js`);
const UserService = require(`./user.js`);

module.exports = {
  ArticleService,
  AuthService,
  CategoryService,
  CommentService,
  SearchService,
  UserService,
};
