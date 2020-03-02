'use strict';

const {Router} = require(`express`);
const PathName = require(`./constants.js`);

const searchRouter = new Router();

searchRouter.get(`/`, (req, res) => res.send(`/${PathName.SEARCH}`));

module.exports = searchRouter;
