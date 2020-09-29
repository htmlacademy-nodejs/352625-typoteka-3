'use strict';

const {Router} = require(`express`);

const {db} = require(`./../../../db/db.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const categoriesRouter = new Router();

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const data = await db.Category.findAll({raw: true});

    res.json(data);

    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});


module.exports = categoriesRouter;
