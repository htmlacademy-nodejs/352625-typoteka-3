'use strict';

const {Router} = require(`express`);

const {renderMyTicketPage, renderCommentsPage} = require(`./render.js`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => renderMyTicketPage(req, res));
myRouter.get(`/comments`, (req, res) => renderCommentsPage(req, res));

module.exports = myRouter;
