'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const validateArticle = () => {
  // TODO: validating code is coming soon...
  return true;
};

module.exports = () => (
  (req, res, next) => {
    if (!validateArticle()) {
      res.status(HttpCode.BAD_REQUEST).send(`Incorrect article format`);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }

    next();
  }
);
