'use strict';

const {Router} = require(`express`);

const {renderSearchPage} = require(`./render.js`);

const searchRouter = new Router();

searchRouter.get(`/`, (req, res) => renderSearchPage(req, res));

module.exports = searchRouter;
