'use strict';

const {Router} = require(`express`);
const {PathName} = require(`./constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();


module.exports = (app, searchService) => {
  const route = new Router();

  app.use(`/api/search`, route);

  route.get(`/`, async (req, res) => {
    try {
      const typingData = req.query.query;
      let data = await searchService.findSome(typingData);

      if (typingData === ``) {
        data = [];
      }

      res.status(HttpCode.OK).json(data);
      logger.debug(`${req.method} /${PathName.SEARCH}${req.url} --> res status code ${res.statusCode}`);

    } catch (error) {
      logger.error(`Error occurs: ${error}`);
    }
  });
};
