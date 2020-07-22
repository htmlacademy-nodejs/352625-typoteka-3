'use strict';

const {Router} = require(`express`);
const fs = require(`fs`);
const {promisify} = require(`util`);

const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty, PathName} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const searchRouter = new Router();

const readFile = promisify(fs.readFile);

searchRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
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
    logger.debug(`${req.method} /${PathName.SEARCH}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = searchRouter;
