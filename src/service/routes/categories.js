'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);
const getMock = require(`./../mocks-data.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const categoriesRouter = new Router();

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const data = await getMock();

    const result = [...(new Set(data
      .map((elem) => elem.category || Empty.DATA).flat()
      .map((category) => JSON.stringify(category))
    ))].map((text) => JSON.parse(text));

    if (result === [Empty.DATA]) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORIES);
    } else {
      res.json(result);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = categoriesRouter;
