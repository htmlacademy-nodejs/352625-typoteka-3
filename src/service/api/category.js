'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();


module.exports = (app, categoryService) => {
  const route = new Router();

  app.use(`/api/categories`, route);

  route.get(`/`, async (req, res) => {
    try {
      const data = await categoryService.findAll();

      if (!data) {
        res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORY);
      } else {
        res.status(HttpCode.OK).json(data);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/id=:id&page=:pageNumber`, async (req, res) => {
    try {
      let data = null;
      const categoryId = parseInt(req.params.id, 10);
      const pageNumber = parseInt(req.params.pageNumber, 10);

      if (categoryId && pageNumber > 0) {
        data = await categoryService.findOne(categoryId, pageNumber);
      }

      if (!data) {
        res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORY);
      } else {
        res.status(HttpCode.OK).json(data);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });
};
