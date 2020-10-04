'use strict';

const {Router} = require(`express`);

const getCategories = require(`./utils/categories.js`);
const getCategory = require(`./utils/category.js`);

const {Empty} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const categoriesRouter = new Router();

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const data = await getCategories();

    if (!data) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORY);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

categoriesRouter.get(`/:id`, async (req, res) => {
  try {
    const data = await getCategory(req.params.id);

    if (!data) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORY);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});


module.exports = categoriesRouter;
