'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

module.exports = (param, mock) => (
  (req, res, next) => {
    const properParam = parseInt(req.params[`${param}`], 10);

    if (!properParam || properParam < 0) {
      res.status(HttpCode.BAD_REQUEST).json(mock);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }

    next();
  }
);
