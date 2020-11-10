'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

module.exports = (mock) => (
  (req, res) => {
    try {
      res.status(HttpCode.OK).json(res.body);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(mock);
      logger.error(`Error occurs: ${error}`);
    }
  });
