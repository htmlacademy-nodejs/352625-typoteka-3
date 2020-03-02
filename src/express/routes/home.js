'use strict';

const {Router} = require(`express`);

const homeRouter = new Router();

homeRouter.get(`/`, (req, res) => res.send(`/`));

module.exports = homeRouter;
