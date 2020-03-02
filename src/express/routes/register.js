'use strict';

const {Router} = require(`express`);
const PathName = require(`./constants.js`);

const registerRouter = new Router();

registerRouter.get(`/`, (req, res) => res.send(`/${PathName.REGISTER}`));

module.exports = registerRouter;
