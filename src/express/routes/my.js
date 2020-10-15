'use strict';

const {Router} = require(`express`);

const {
  renderMyTicketsPage,
  renderCommentsPage,
  deleteCommentFromService,
  deleteArticleFromService,
} = require(`./render.js`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => renderMyTicketsPage(req, res));
myRouter.get(`/comments`, (req, res) => renderCommentsPage(req, res));

myRouter.post(`/comments/delete/:commentId`, (req, res) => deleteCommentFromService(req, res));
myRouter.post(`/articles/delete/:articleId`, (req, res) => deleteArticleFromService(req, res));

module.exports = myRouter;
