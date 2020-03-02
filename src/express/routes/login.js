'use strict';

const {Router} = require(`express`);
const PathName = require(`./constants.js`);

const loginRouter = new Router();

loginRouter.get(`/`, (req, res) => res.send(`/${PathName.LOGIN}`));

module.exports = loginRouter;
