'use strict';

const {Router} = require(`express`);

const {render404Page, render500Page} = require(`./render.js`);

const errorRouter = new Router();

errorRouter.get(`/404`, (req, res) => render404Page(req, res));
errorRouter.get(`/500`, (req, res) => render500Page(req, res));

module.exports = errorRouter;
