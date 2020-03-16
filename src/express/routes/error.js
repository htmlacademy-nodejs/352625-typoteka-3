'use strict';

const {Router} = require(`express`);

const errorRouter = new Router();

errorRouter.get(`/404`, (req, res) => res.render(`errors/400`));
errorRouter.get(`/500`, (req, res) => res.render(`errors/500`));

module.exports = errorRouter;
