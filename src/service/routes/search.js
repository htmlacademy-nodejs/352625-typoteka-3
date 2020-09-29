'use strict';

const {Router} = require(`express`);

const {db} = require(`./../../../db/db.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => {
  try {

    const articles = await db.Article.findAll({raw: true});

    const result = articles
      .filter((elem) => {
        if (!req.query.query) {
          req.query.query = Empty.DATA;
        }
        return elem.title.toUpperCase().includes(req.query.query.toUpperCase());
      });

    if (result.length === 0 || req.query.query === Empty.DATA) {
      res.json(Empty.SEARCH);
    } else {
      res.json(result);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = searchRouter;
