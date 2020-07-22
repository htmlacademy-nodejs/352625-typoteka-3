'use strict';

const {Router} = require(`express`);

const {renderMyTicketsPage, renderCommentsPage} = require(`./render.js`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => renderMyTicketsPage(req, res));
myRouter.get(`/comments`, (req, res) => renderCommentsPage(req, res));

module.exports = myRouter;
