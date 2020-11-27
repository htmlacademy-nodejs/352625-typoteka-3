'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {tryToResponse} = require(`../middlewares`);


module.exports = (app, searchService) => {
  const route = new Router();

  app.use(`/api/search`, route);

  route.get(
      `/`,
      async (req, res, next) => {
        const typingData = req.query.query;
        res.body = await searchService.findSome(typingData);

        if (typingData === ``) {
          res.body = Empty.SEARCH;
        }

        next();
      },
      tryToResponse(HttpCode.OK, Empty.SEARCH)
  );
};
