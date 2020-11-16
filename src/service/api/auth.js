'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {passNotNullData, tryToResponse} = require(`../middlewares`);


module.exports = (app, authService) => {
  const route = new Router();

  app.use(`/api/auth`, route);

  route.get(
    `/`,
    async (req, res, next) => {
      res.body = await authService.get();
      next();
    },
    tryToResponse(HttpCode.OK)
  );
};
