'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

const MY_PATH_NAME = `my`;

myRouter.get(`/`, (req, res) => res.send(`/${MY_PATH_NAME}`));
myRouter.get(`/comments`, (req, res) => res.send(`/${MY_PATH_NAME}/comments`));

module.exports = {
  MY_PATH_NAME,
  myRouter,
};
