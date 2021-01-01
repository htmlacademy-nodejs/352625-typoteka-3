'use strict';

const {Router} = require(`express`);

const article = require(`./article.js`);
const category = require(`./category.js`);
const comment = require(`./comment.js`);
const search = require(`./search.js`);
const user = require(`./user.js`);

const {
  ArticleService,
  CategoryService,
  CommentService,
  SearchService,
  UserService,
} = require(`./../data-service`);

const app = new Router();

(async () => {
  category(app, new CategoryService(), new UserService());
  comment(app, new CommentService());
  search(app, new SearchService());
  article(app, new ArticleService(), new CommentService(), new UserService());
  user(app, new UserService());
})();

module.exports = app;
