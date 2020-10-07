'use strict';

const {Router} = require(`express`);

const {renderMyTicketsPage, renderCommentsPage, deleteCommentFromService} = require(`./render.js`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => renderMyTicketsPage(req, res));
myRouter.get(`/comments`, (req, res) => renderCommentsPage(req, res));
// TODO не получилось реализвать удаление коммента через метод DELETE
myRouter.post(`/comments/:commentId`, (req, res) => deleteCommentFromService(req, res));

module.exports = myRouter;
