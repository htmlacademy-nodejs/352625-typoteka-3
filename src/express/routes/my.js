'use strict';

const {Router} = require(`express`);
const PathName = require(`./constants.js`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.send(`/${PathName.MY}`));
myRouter.get(`/comments`, (req, res) => res.send(`/${PathName.MY}/comments`));

module.exports = myRouter;
