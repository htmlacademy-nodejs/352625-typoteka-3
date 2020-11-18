'use strict';

const {Router} = require(`express`);

const article = require(`./article.js`);
const auth = require(`./auth.js`);
const category = require(`./category.js`);
const comment = require(`./comment.js`);
const search = require(`./search.js`);

const {
  ArticleService,
  AuthService,
  CategoryService,
  CommentService,
  SearchService,
} = require(`./../data-service`);

const app = new Router();

(async () => {
  auth(app, new AuthService());
  category(app, new CategoryService());
  comment(app, new CommentService(), new AuthService());
  search(app, new SearchService());
  article(app, new ArticleService(), new AuthService(), new CommentService());
})();

module.exports = app;
