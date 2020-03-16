'use strict';

const {Router} = require(`express`);

const homeRouter = new Router();

homeRouter.get(`/`, (req, res) => res.render(`main`));

module.exports = homeRouter;
